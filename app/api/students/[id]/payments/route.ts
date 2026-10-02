import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/students/[id]/payments - Get payment history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: studentId } = await params;
    
    // Students can only access their own payments
    if (session.user.role === 'STUDENT' && session.user.id !== studentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Admins and coaches can access any student's payments
    if (!['ADMIN', 'COACH', 'STUDENT'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = await getDatabase();

    const payments = await db.collection("payments")
      .find({ studentId: studentId })
      .sort({ completedAt: -1 })
      .toArray();

    // Enrich with course information
    const courseIds = payments.map(p => new ObjectId(p.courseId));
    const courses = await db.collection("courses")
      .find({ _id: { $in: courseIds } })
      .toArray();

    const enrichedPayments = payments.map(payment => {
      const course = courses.find(c => c._id.toString() === payment.courseId);
      return {
        ...payment,
        id: payment._id.toString(),
        course: course ? {
          id: course._id.toString(),
          title: course.title,
          image: course.image,
          category: course.category
        } : null
      };
    });

    return NextResponse.json(enrichedPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
