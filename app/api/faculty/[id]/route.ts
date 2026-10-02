import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/faculty/[id] - Get single faculty member details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    // Get teacher details
    const teacher = await db.collection("users").findOne({
      id: id,
      role: 'COACH',
      status: { $ne: 'suspended' }
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }

    // Get profile
    const profile = await db.collection("teacher_profiles").findOne({
      teacherId: id
    });

    // Get courses
    const courses = await db.collection("courses")
      .find({ teacherId: id, status: 'published' })
      .sort({ createdAt: -1 })
      .toArray();

    // Get enrollments
    const enrollments = await db.collection("enrollments")
      .find({ teacherId: id })
      .toArray();

    const totalStudents = new Set(enrollments.map(e => e.studentId)).size;

    // Get reviews
    const courseIds = courses.map(c => c._id.toString());
    const reviews = await db.collection("reviews")
      .find({ courseId: { $in: courseIds } })
      .sort({ createdAt: -1 })
      .toArray();

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Enrich courses with student count
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments = await db.collection("enrollments")
          .countDocuments({ courseId: course._id.toString() });

        const courseReviews = await db.collection("reviews")
          .find({ courseId: course._id.toString() })
          .toArray();

        const courseRating = courseReviews.length > 0
          ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
          : 0;

        return {
          ...course,
          studentsEnrolled: courseEnrollments,
          averageRating: Math.round(courseRating * 10) / 10,
          totalReviews: courseReviews.length
        };
      })
    );

    const facultyDetails = {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      image: teacher.image || profile?.image,
      bio: profile?.bio || `Experienced educator specializing in ${teacher.specialization?.join(', ') || 'technology training'}`,
      specialization: teacher.specialization || profile?.specialization || [],
      qualifications: profile?.qualifications || [],
      experience: profile?.experience || '5+ years',
      rating: Math.round(averageRating * 10) / 10,
      totalStudents,
      totalCourses: courses.length,
      location: profile?.location || 'India',
      languages: profile?.languages || ['English', 'Hindi'],
      achievements: profile?.achievements || [],
      isVerified: profile?.isVerified || false,
      socialLinks: profile?.socialLinks || {},
      subjects: profile?.subjects || teacher.specialization || [],
      joinedDate: teacher.createdAt || new Date(),
      totalReviews: reviews.length,
      courses: enrichedCourses,
      recentReviews: reviews.slice(0, 5)
    };

    return NextResponse.json(facultyDetails);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty details" },
      { status: 500 }
    );
  }
}

// PUT /api/faculty/[id] - Update faculty profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || !['ADMIN', 'COACH'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Only allow teacher to edit their own profile, or admin to edit any
    if (session.user.role === 'COACH' && session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const profileData = await request.json();
    const db = await getDatabase();

    // Verify the teacher exists
    const teacher = await db.collection("users").findOne({
      id: id,
      role: 'COACH'
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Update profile
    const profile = {
      teacherId: id,
      bio: profileData.bio,
      specialization: profileData.specialization || [],
      qualifications: profileData.qualifications || [],
      experience: profileData.experience,
      location: profileData.location,
      languages: profileData.languages || [],
      achievements: profileData.achievements || [],
      socialLinks: profileData.socialLinks || {},
      subjects: profileData.subjects || [],
      isVerified: session.user.role === 'ADMIN' ? profileData.isVerified : false,
      updatedAt: new Date(),
      updatedBy: session.user.id
    };

    await db.collection("teacher_profiles").updateOne(
      { teacherId: id },
      { 
        $set: profile,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    // Also update user specialization
    await db.collection("users").updateOne(
      { id: id },
      { $set: { specialization: profileData.specialization } }
    );

    return NextResponse.json({
      message: 'Faculty profile updated successfully'
    });
  } catch (error) {
    console.error("Error updating faculty profile:", error);
    return NextResponse.json(
      { error: "Failed to update faculty profile" },
      { status: 500 }
    );
  }
}

// DELETE /api/faculty/[id] - Admin can suspend/remove faculty
export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'suspend'; // suspend or remove

    if (action === 'suspend') {
      // Suspend teacher
      await db.collection("users").updateOne(
        { id: id, role: 'COACH' },
        { 
          $set: { 
            status: 'suspended',
            suspendedAt: new Date(),
            suspendedBy: session.user.id
          }
        }
      );

      // Unpublish all their courses
      await db.collection("courses").updateMany(
        { teacherId: id },
        { 
          $set: { 
            status: 'draft',
            suspendedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        message: 'Faculty suspended successfully'
      });
    } else if (action === 'remove') {
      // Remove teacher role (convert to STUDENT)
      await db.collection("users").updateOne(
        { id: id, role: 'COACH' },
        { 
          $set: { 
            role: 'STUDENT',
            removedAt: new Date(),
            removedBy: session.user.id
          }
        }
      );

      // Archive all their courses
      await db.collection("courses").updateMany(
        { teacherId: id },
        { 
          $set: { 
            status: 'archived',
            archivedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        message: 'Faculty removed successfully'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error("Error removing faculty:", error);
    return NextResponse.json(
      { error: "Failed to remove faculty" },
      { status: 500 }
    );
  }
}
