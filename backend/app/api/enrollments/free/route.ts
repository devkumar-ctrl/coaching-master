import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { sendEnrollmentConfirmation } from '@/lib/email';
import { checkCoupon } from '@/lib/coupons';

export const runtime = 'nodejs';

// POST /api/enrollments/free  { courseId, couponCode }
// Enrolls the signed-in student in a course at ₹0 using a 100% coupon.
// No payment gateway call is made.
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, couponCode } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required for free enrollment' }, { status: 400 });
    }

    const db = await getDatabase();

    const course = await db.collection('courses').findOne({
      _id: new ObjectId(courseId),
      status: 'published',
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or not available' }, { status: 404 });
    }

    const existingEnrollment = await db.collection('enrollments').findOne({
      studentId: session.user.id,
      courseId: courseId,
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    const validation = await checkCoupon({
      db,
      code: couponCode,
      courseId,
      studentId: session.user.id,
      coursePrice: Number(course.price) || 0,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error || 'Invalid coupon' }, { status: 400 });
    }

    if (!validation.isFree) {
      return NextResponse.json(
        {
          error: `Coupon does not cover the full price (final amount ₹${validation.finalAmount}). Complete payment to enroll.`,
          finalAmount: validation.finalAmount,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const freePaymentId = `free_${Date.now().toString(36)}_${session.user.id.slice(-6)}`;

    const enrollment = {
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      courseId: courseId,
      courseTitle: course.title,
      teacherId: course.teacherId,
      paymentId: freePaymentId,
      amountPaid: 0,
      originalAmount: validation.originalAmount,
      discountAmount: validation.discountAmount,
      discountPercent: validation.discountPercent,
      couponCode: validation.code,
      paymentMethod: 'coupon_free',
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
            studentId: session.user.id,
            studentName: session.user.name || 'Unknown',
            enrolledAt: now,
            paymentId: freePaymentId,
          },
        },
      }
    );

    await db.collection('payments').insertOne({
      paymentId: freePaymentId,
      orderId: null,
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      courseId: courseId,
      courseTitle: course.title,
      teacherId: course.teacherId,
      amount: 0,
      originalAmount: validation.originalAmount,
      discountAmount: validation.discountAmount,
      discountPercent: validation.discountPercent,
      couponCode: validation.code,
      paymentMethod: 'coupon_free',
      currency: 'INR',
      status: 'completed',
      enrollmentId: enrollmentResult.insertedId.toString(),
      completedAt: now,
      signature: null,
    });

    await db.collection('coupons').updateOne(
      { code: validation.code },
      {
        $inc: { usedCount: 1 },
        $push: {
          usedBy: {
            studentId: session.user.id,
            studentEmail: session.user.email ?? null,
            enrollmentId: enrollmentResult.insertedId.toString(),
            usedAt: now,
          },
        } as any,
        $set: { updatedAt: now },
      }
    );

    try {
      if (session.user.email) {
        await sendEnrollmentConfirmation({
          studentName: session.user.name || 'Student',
          studentEmail: session.user.email,
          courseTitle: course.title,
          teacherName: course.teacherName || 'Instructor',
          enrollmentDate: now,
          courseId: courseId,
          paymentId: freePaymentId,
        });
      }
    } catch (emailError) {
      console.error('Failed to send enrollment confirmation email:', emailError);
    }

    return NextResponse.json({
      message: 'Successfully enrolled in course for free',
      enrollmentId: enrollmentResult.insertedId.toString(),
      couponCode: validation.code,
      discountPercent: validation.discountPercent,
      amountPaid: 0,
    });
  } catch (error) {
    console.error('Error creating free enrollment:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}
