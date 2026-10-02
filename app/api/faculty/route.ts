import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/faculty - Get all faculty members for public display
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const limit = parseInt(searchParams.get('limit') || '0');

    // Build query - look for COACH role users (teachers)
    let query: any = { 
      role: 'COACH',
      status: { $ne: 'suspended' } // Don't show suspended teachers
    };

    if (specialization && specialization !== 'all') {
      query.specialization = { $in: [specialization] };
    }

    // Get teachers from users collection
    const teachers = await db.collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit || 0)
      .toArray();

    // Enrich with additional data
    const enrichedFaculty = await Promise.all(
      teachers.map(async (teacher) => {
        // Get courses count
        const coursesCount = await db.collection("courses")
          .countDocuments({ teacherId: teacher._id.toString(), status: 'published' });

        // Get total students (unique enrollments) - only if not manually set by admin
        let totalStudents = teacher.totalStudents || 0;
        if (!teacher.totalStudents) {
          const enrollments = await db.collection("enrollments")
            .find({ teacherId: teacher._id.toString() })
            .toArray();
          
          totalStudents = new Set(enrollments.map(e => e.studentId)).size;
        }

        // Get rating - use admin-set rating if available, otherwise calculate from reviews
        let averageRating = teacher.rating || 0;
        let totalReviews = 0;
        if (!teacher.rating) {
          const teacherCourses = await db.collection("courses")
            .find({ teacherId: teacher._id.toString() })
            .toArray();
          
          const courseIds = teacherCourses.map(c => c._id.toString());
          
          const reviews = await db.collection("reviews")
            .find({ courseId: { $in: courseIds } })
            .toArray();

          averageRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;
          
          totalReviews = reviews.length;
        }

        // Get teacher profile (if exists)
        const profile = await db.collection("teacher_profiles").findOne({
          teacherId: teacher._id.toString()
        });

        return {
          id: teacher._id.toString(),
          name: teacher.name,
          email: teacher.email,
          image: teacher.image || profile?.image,
          bio: teacher.bio || profile?.bio || `Experienced educator specializing in ${teacher.specialization?.join(', ') || 'technology training'}`,
          specialization: teacher.specialization || profile?.specialization || [],
          qualifications: teacher.qualifications || profile?.qualifications || [],
          experience: teacher.experience ? `${teacher.experience} years` : (profile?.experience || '5+ years'),
          rating: Math.round(averageRating * 10) / 10,
          totalStudents,
          totalCourses: coursesCount,
          location: teacher.location || profile?.location || 'India',
          languages: profile?.languages || ['English', 'Hindi'],
          achievements: profile?.achievements || [],
          isVerified: teacher.isVerified !== undefined ? teacher.isVerified : (profile?.isVerified || false),
          socialLinks: profile?.socialLinks || {},
          subjects: profile?.subjects || teacher.specialization || [],
          joinedDate: teacher.createdAt || new Date(),
          totalReviews
        };
      })
    );

    return NextResponse.json(enrichedFaculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}

// POST /api/faculty - Admin can create/update faculty profiles
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !['ADMIN', 'COACH'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData = await request.json();
    const db = await getDatabase();

    // Verify the teacher exists
    const teacher = await db.collection("users").findOne({
      id: profileData.teacherId,
      role: 'COACH'
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Only allow teacher to edit their own profile, or admin to edit any
    if (session.user.role === 'COACH' && session.user.id !== profileData.teacherId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update or create teacher profile
    const profile = {
      teacherId: profileData.teacherId,
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

    const result = await db.collection("teacher_profiles").updateOne(
      { teacherId: profileData.teacherId },
      { 
        $set: profile,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    // Also update user specialization
    await db.collection("users").updateOne(
      { id: profileData.teacherId },
      { $set: { specialization: profileData.specialization } }
    );

    return NextResponse.json({
      message: 'Faculty profile updated successfully',
      profileId: result.upsertedId?.toString() || 'updated'
    });
  } catch (error) {
    console.error("Error updating faculty profile:", error);
    return NextResponse.json(
      { error: "Failed to update faculty profile" },
      { status: 500 }
    );
  }
}
