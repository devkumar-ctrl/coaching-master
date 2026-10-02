import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/reviews - Get reviews (with course filter)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const teacherId = searchParams.get('teacherId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status') || 'published';

    // Build query
    let query: any = { status };
    
    if (courseId) {
      query.courseId = courseId;
    }
    
    if (teacherId) {
      query.teacherId = teacherId;
    }

    const skip = (page - 1) * limit;

    const reviews = await db.collection("reviews")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("reviews").countDocuments(query);

    // Enrich with user and course details
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const [user, course] = await Promise.all([
          db.collection("users").findOne({ id: review.studentId }),
          db.collection("courses").findOne({ _id: { $oid: review.courseId } })
        ]);

        return {
          id: review._id.toString(),
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          createdAt: review.createdAt,
          student: {
            id: user?.id,
            name: user?.name || 'Anonymous',
            image: user?.image
          },
          course: course ? {
            id: course._id.toString(),
            title: course.title,
            thumbnail: course.thumbnail
          } : null,
          helpful: review.helpful || 0,
          reported: review.reported || false
        };
      })
    );

    return NextResponse.json({
      reviews: enrichedReviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review (Students only, must be enrolled)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewData = await request.json();
    const db = await getDatabase();

    // Verify student is enrolled in the course
    const enrollment = await db.collection("enrollments").findOne({
      studentId: session.user.id,
      courseId: reviewData.courseId,
      status: 'active'
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled in this course to leave a review' },
        { status: 403 }
      );
    }

    // Check if user already reviewed this course
    const existingReview = await db.collection("reviews").findOne({
      studentId: session.user.id,
      courseId: reviewData.courseId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this course' },
        { status: 400 }
      );
    }

    // Get course details for teacher ID
    const course = await db.collection("courses").findOne({
      _id: { $oid: reviewData.courseId }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const review = {
      studentId: session.user.id,
      courseId: reviewData.courseId,
      teacherId: course.teacherId,
      rating: Math.max(1, Math.min(5, reviewData.rating)), // Ensure rating is 1-5
      comment: reviewData.comment,
      status: 'published', // Auto-publish, but admin can moderate
      helpful: 0,
      reported: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("reviews").insertOne(review);

    // Update course average rating
    await updateCourseRating(db, reviewData.courseId);

    return NextResponse.json({
      message: 'Review submitted successfully',
      reviewId: result.insertedId.toString()
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// Helper function to update course average rating
async function updateCourseRating(db: any, courseId: string) {
  try {
    const reviews = await db.collection("reviews")
      .find({ courseId, status: 'published' })
      .toArray();

    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;
      
      await db.collection("courses").updateOne(
        { _id: { $oid: courseId } },
        { 
          $set: { 
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            updatedAt: new Date()
          }
        }
      );
    }
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
}
