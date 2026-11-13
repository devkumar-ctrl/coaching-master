import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { sendEnrollmentConfirmation } from '@/lib/email';

export const runtime = 'nodejs';

// POST /api/admin/enrollments  { userId, courseIds: string[] }
// Grants a student free (₹0) access to one or more published courses.
// No payment gateway call is made. Records a zero-amount payment + admin activity.
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const userId = String(body?.userId || '').trim();
    const courseIds: string[] = Array.isArray(body?.courseIds)
      ? body.courseIds.map((c: unknown) => String(c)).filter(Boolean)
      : body?.courseId
        ? [String(body.courseId)]
        : [];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    if (courseIds.length === 0) {
      return NextResponse.json({ error: 'Select at least one course' }, { status: 400 });
    }

    const db = await getDatabase();

    // Resolve the user by custom `id` first, then by Mongo `_id`.
    let user = await db.collection('users').findOne({ id: userId });
    if (!user && ObjectId.isValid(userId)) {
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    }
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Enrollments are keyed by the user's custom id across the app.
    const studentId = user.id || user._id.toString();
    const now = new Date();

    const assigned: { courseId: string; courseTitle: string }[] = [];
    const skipped: { courseId: string; courseTitle?: string; reason: string }[] = [];

    for (const courseId of courseIds) {
      if (!ObjectId.isValid(courseId)) {
        skipped.push({ courseId, reason: 'Invalid course ID' });
        continue;
      }

      const course = await db.collection('courses').findOne({
        _id: new ObjectId(courseId),
      });

      if (!course) {
        skipped.push({ courseId, reason: 'Course not found' });
        continue;
      }

      if (!['published', 'PUBLISHED', 'active'].includes(course.status)) {
        skipped.push({ courseId, courseTitle: course.title, reason: 'Course is not active' });
        continue;
      }

      const existing = await db.collection('enrollments').findOne({ studentId, courseId });
      if (existing) {
        skipped.push({ courseId, courseTitle: course.title, reason: 'Already enrolled' });
        continue;
      }

      const price = Number(course.price) || 0;
      const grantPaymentId = `grant_${Date.now().toString(36)}_${studentId.slice(-6)}`;

      const enrollment = {
        studentId,
        studentName: user.name,
        studentEmail: user.email,
        courseId,
        courseTitle: course.title,
        teacherId: course.teacherId,
        paymentId: grantPaymentId,
        amountPaid: 0,
        originalAmount: price,
        discountAmount: price,
        discountPercent: price > 0 ? 100 : 0,
        couponCode: null,
        paymentMethod: 'admin_grant',
        grantedBy: session.user.id,
        enrolledAt: now,
        status: 'active',
        progress: 0,
        completedClasses: 0,
      };

      const enrollmentResult = await db.collection('enrollments').insertOne(enrollment);

      await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId) },
        {
          $inc: { enrolledCount: 1 },
          $addToSet: {
            enrolledStudents: {
              studentId,
              studentName: user.name || 'Unknown',
              enrolledAt: now,
              paymentId: grantPaymentId,
            },
          },
        }
      );

      await db.collection('payments').insertOne({
        paymentId: grantPaymentId,
        orderId: null,
        studentId,
        studentName: user.name,
        studentEmail: user.email,
        courseId,
        courseTitle: course.title,
        teacherId: course.teacherId,
        amount: 0,
        originalAmount: price,
        discountAmount: price,
        discountPercent: price > 0 ? 100 : 0,
        couponCode: null,
        paymentMethod: 'admin_grant',
        currency: 'INR',
        status: 'completed',
        enrollmentId: enrollmentResult.insertedId.toString(),
        completedAt: now,
        signature: null,
      });

      assigned.push({ courseId, courseTitle: course.title });

      try {
        if (user.email) {
          await sendEnrollmentConfirmation({
            studentName: user.name || 'Student',
            studentEmail: user.email,
            courseTitle: course.title,
            teacherName: course.teacherName || 'Instructor',
            enrollmentDate: now,
            courseId,
            paymentId: grantPaymentId,
          });
        }
      } catch (emailError) {
        console.error('Failed to send enrollment confirmation email:', emailError);
      }
    }

    if (assigned.length > 0) {
      await db.collection('admin_activities').insertOne({
        type: 'enrollment_granted',
        message: `Granted free access to ${assigned.length} course(s) for ${user.name}`,
        userId: studentId,
        userName: user.name,
        userEmail: user.email,
        courseTitles: assigned.map((a) => a.courseTitle),
        adminId: session.user.id,
        adminName: session.user.name,
        timestamp: now.toISOString(),
        createdAt: now,
      });
    }

    return NextResponse.json({
      message:
        assigned.length > 0
          ? `Granted free access to ${assigned.length} course(s)${skipped.length ? `, skipped ${skipped.length}` : ''}`
          : 'No courses were assigned',
      assigned,
      skipped,
    });
  } catch (error) {
    console.error('Error granting enrollment:', error);
    return NextResponse.json({ error: 'Failed to assign course' }, { status: 500 });
  }
}
