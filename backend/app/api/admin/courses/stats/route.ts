import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/courses/stats - Get course statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Get course counts by status
    const [
      totalCourses,
      publishedCourses,
      draftCourses,
      archivedCourses,
      enrollments,
      payments,
      reviews,
      activeTeachers
    ] = await Promise.all([
      db.collection("courses").countDocuments({}),
      db.collection("courses").countDocuments({ status: 'PUBLISHED' }),
      db.collection("courses").countDocuments({ status: 'DRAFT' }),
      db.collection("courses").countDocuments({ status: 'ARCHIVED' }),
      db.collection("enrollments").find({}).toArray(),
      db.collection("payments").find({}).toArray(),
      db.collection("reviews").find({}).toArray(),
      db.collection("users").countDocuments({ role: 'COACH' })
    ]);

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? Math.round((reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length) * 10) / 10
      : 0;

    const stats = {
      totalCourses,
      publishedCourses,
      draftCourses,
      archivedCourses,
      totalEnrollments: enrollments.length,
      totalRevenue,
      averageRating,
      activeTeachers
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching course stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch course statistics" },
      { status: 500 }
    );
  }
}
