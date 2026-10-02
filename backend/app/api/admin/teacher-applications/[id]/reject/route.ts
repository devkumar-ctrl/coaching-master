import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// POST /api/admin/teacher-applications/[id]/reject - Reject teacher application
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const db = await getDatabase();

    // Update application status
    const applicationResult = await db.collection("teacher_applications").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectedBy: session.user.id,
          rejectionReason: reason.trim()
        }
      }
    );

    if (applicationResult.matchedCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Get the application details
    const application = await db.collection("teacher_applications").findOne({
      _id: new ObjectId(id)
    });

    if (application) {
      // Add to recent activity
      await db.collection("admin_activities").insertOne({
        type: 'teacher_rejected',
        message: `Teacher application rejected: ${application.name}`,
        teacherName: application.name,
        teacherEmail: application.email,
        rejectionReason: reason.trim(),
        adminId: session.user.id,
        adminName: session.user.name,
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      });

      // TODO: Send rejection email to applicant
      // You can integrate with your email service here
      console.log(`Rejection email should be sent to ${application.email} with reason: ${reason}`);
    }

    return NextResponse.json({ 
      message: 'Application rejected successfully',
      rejected: true 
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
