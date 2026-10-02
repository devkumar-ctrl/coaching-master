import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// POST /api/admin/teacher-applications/[id]/approve - Approve teacher application
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
    const db = await getDatabase();

    // Update application status
    const applicationResult = await db.collection("teacher_applications").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: session.user.id
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
      // Check if user already exists
      const existingUser = await db.collection("users").findOne({
        email: application.email
      });

      if (existingUser) {
        // Update existing user to teacher role
        await db.collection("users").updateOne(
          { email: application.email },
          { 
            $set: { 
              role: 'COACH',
              isVerified: true,
              qualifications: application.qualifications,
              specialization: application.specialization,
              experience: application.experience,
              achievements: application.achievements,
              languages: application.languages,
              bio: application.bio,
              phone: application.phone,
              location: application.location,
              subjects: application.specialization || [],
              rating: 0,
              totalStudents: 0,
              totalCourses: 0,
              totalReviews: 0,
              socialLinks: {},
              updatedAt: new Date()
            }
          }
        );
      } else {
        // Create new teacher user
        await db.collection("users").insertOne({
          name: application.name,
          email: application.email,
          image: application.image || null,
          role: 'COACH',
          isVerified: true,
          qualifications: application.qualifications,
          specialization: application.specialization,
          experience: application.experience,
          achievements: application.achievements,
          languages: application.languages,
          bio: application.bio,
          phone: application.phone,
          location: application.location,
          subjects: application.specialization || [],
          rating: 0,
          totalStudents: 0,
          totalCourses: 0,
          totalReviews: 0,
          socialLinks: {},
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Add to recent activity
      await db.collection("admin_activities").insertOne({
        type: 'teacher_approved',
        message: `Teacher application approved: ${application.name}`,
        teacherName: application.name,
        teacherEmail: application.email,
        adminId: session.user.id,
        adminName: session.user.name,
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      });
    }

    return NextResponse.json({ 
      message: 'Application approved successfully',
      approved: true 
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { error: "Failed to approve application" },
      { status: 500 }
    );
  }
}
