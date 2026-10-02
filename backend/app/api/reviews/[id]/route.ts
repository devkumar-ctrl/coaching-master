import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/reviews/[id] - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    const review = await db.collection("reviews").findOne({
      _id: new ObjectId(id)
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Get user and course details
    const [user, course] = await Promise.all([
      db.collection("users").findOne({ id: review.studentId }),
      db.collection("courses").findOne({ _id: { $oid: review.courseId } })
    ]);

    const enrichedReview = {
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

    return NextResponse.json(enrichedReview);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update review (Student can edit their own, Admin can moderate)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const reviewData = await request.json();
    const db = await getDatabase();

    // Get existing review
    const existingReview = await db.collection("reviews").findOne({
      _id: new ObjectId(id)
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = existingReview.studentId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let updateData: any = {
      updatedAt: new Date()
    };

    if (isOwner) {
      // Students can only edit rating and comment
      updateData.rating = Math.max(1, Math.min(5, reviewData.rating));
      updateData.comment = reviewData.comment;
    }

    if (isAdmin) {
      // Admins can moderate (change status, mark as reported, etc.)
      if (reviewData.status) updateData.status = reviewData.status;
      if (typeof reviewData.reported === 'boolean') updateData.reported = reviewData.reported;
    }

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Update course rating if rating changed
    if (updateData.rating) {
      await updateCourseRating(db, existingReview.courseId);
    }

    return NextResponse.json({
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete review (Student can delete their own, Admin can delete any)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();

    // Get existing review
    const existingReview = await db.collection("reviews").findOne({
      _id: new ObjectId(id)
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = existingReview.studentId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(id)
    });

    // Update course rating
    await updateCourseRating(db, existingReview.courseId);

    return NextResponse.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
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

    let averageRating = 0;
    if (reviews.length > 0) {
      averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;
    }

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
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
}
