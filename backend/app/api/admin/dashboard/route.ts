import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/admin/dashboard - Get comprehensive admin dashboard data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const db = await getDatabase();

    // Get comprehensive statistics
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalPayments,
      totalMeetings,
      totalReviews,
      recentUsers,
      recentCourses,
      recentPayments,
      pendingRequests
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("courses").countDocuments(),
      db.collection("enrollments").countDocuments(),
      db.collection("payments").countDocuments(),
      db.collection("course_meetings").countDocuments(),
      db.collection("reviews").countDocuments(),
      db.collection("users").find().sort({ createdAt: -1 }).limit(10).toArray(),
      db.collection("courses").find().sort({ createdAt: -1 }).limit(10).toArray(),
      db.collection("payments").find().sort({ completedAt: -1 }).limit(10).toArray(),
      db.collection("teacher_requests").countDocuments({ status: 'pending' })
    ]);

    // Calculate revenue
    const paymentsData = await db.collection("payments").find().toArray();
    const totalRevenue = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
    const thisMonthRevenue = paymentsData
      .filter(p => new Date(p.completedAt).getMonth() === new Date().getMonth())
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Get user breakdown
    const userBreakdown = await db.collection("users").aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const stats = {
      totalUsers,
      totalStudents: userBreakdown.find(u => u._id === 'STUDENT')?.count || 0,
      totalTeachers: userBreakdown.find(u => u._id === 'COACH')?.count || 0,
      totalAdmins: userBreakdown.find(u => u._id === 'ADMIN')?.count || 0,
      totalCourses,
      publishedCourses: await db.collection("courses").countDocuments({ status: 'published' }),
      draftCourses: await db.collection("courses").countDocuments({ status: 'draft' }),
      totalEnrollments,
      totalRevenue,
      thisMonthRevenue,
      totalMeetings,
      liveMeetings: await db.collection("course_meetings").countDocuments({ status: 'live' }),
      scheduledMeetings: await db.collection("course_meetings").countDocuments({ status: 'scheduled' }),
      totalReviews,
      averageRating: totalReviews > 0 ? 
        (await db.collection("reviews").aggregate([
          { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]).toArray())[0]?.avgRating || 0 : 0,
      pendingRequests,
      recentActivity: [
        ...recentUsers.map(user => ({
          type: 'user_registered',
          message: `New ${user.role.toLowerCase()} registered: ${user.name}`,
          timestamp: user.createdAt || new Date(),
          userId: user.id
        })),
        ...recentCourses.map(course => ({
          type: 'course_created',
          message: `New course created: ${course.title}`,
          timestamp: course.createdAt,
          courseId: course._id.toString()
        })),
        ...recentPayments.map(payment => ({
          type: 'payment_received',
          message: `Payment received: ₹${payment.amount} for ${payment.courseTitle}`,
          timestamp: payment.completedAt,
          paymentId: payment.paymentId
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15)
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// POST /api/admin/dashboard - Admin actions
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, data } = await request.json();
    const db = await getDatabase();

    switch (action) {
      case 'approve_teacher':
        await db.collection("users").updateOne(
          { id: data.userId },
          { $set: { role: 'COACH', approvedAt: new Date() } }
        );
        await db.collection("teacher_requests").updateOne(
          { userId: data.userId },
          { $set: { status: 'approved', approvedAt: new Date(), approvedBy: session.user.id } }
        );
        return NextResponse.json({ message: 'Teacher approved successfully' });

      case 'reject_teacher':
        await db.collection("teacher_requests").updateOne(
          { userId: data.userId },
          { $set: { status: 'rejected', rejectedAt: new Date(), rejectedBy: session.user.id, reason: data.reason } }
        );
        return NextResponse.json({ message: 'Teacher request rejected' });

      case 'suspend_user':
        await db.collection("users").updateOne(
          { id: data.userId },
          { $set: { status: 'suspended', suspendedAt: new Date(), suspendedBy: session.user.id, suspensionReason: data.reason } }
        );
        return NextResponse.json({ message: 'User suspended successfully' });

      case 'activate_user':
        await db.collection("users").updateOne(
          { id: data.userId },
          { $unset: { status: "", suspendedAt: "", suspendedBy: "", suspensionReason: "" } }
        );
        return NextResponse.json({ message: 'User activated successfully' });

      case 'delete_course':
        // Soft delete - mark as deleted instead of removing
        await db.collection("courses").updateOne(
          { _id: new ObjectId(data.courseId) },
          { $set: { status: 'deleted', deletedAt: new Date(), deletedBy: session.user.id } }
        );
        return NextResponse.json({ message: 'Course deleted successfully' });

      case 'feature_course':
        await db.collection("courses").updateOne(
          { _id: new ObjectId(data.courseId) },
          { $set: { featured: true, featuredAt: new Date() } }
        );
        return NextResponse.json({ message: 'Course featured successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error performing admin action:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}
