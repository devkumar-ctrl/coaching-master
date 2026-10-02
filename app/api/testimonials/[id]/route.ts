import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/testimonials/[id] - Get single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDatabase();
    const { id } = await params;

    const testimonial = await db.collection("testimonials").findOne({
      _id: new ObjectId(id)
    });

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // Get user details
    const user = await db.collection("users").findOne({
      id: testimonial.userId
    });

    const enrichedTestimonial = {
      id: testimonial._id.toString(),
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      status: testimonial.status,
      createdAt: testimonial.createdAt,
      user: {
        id: user?.id,
        name: user?.name || 'Anonymous',
        image: user?.image,
        designation: testimonial.userDesignation || 'Tech Student'
      },
      achievement: testimonial.achievement,
      rank: testimonial.rank,
      year: testimonial.year
    };

    return NextResponse.json(enrichedTestimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Update testimonial (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const testimonialData = await request.json();
    const db = await getDatabase();

    const updateData: any = {
      content: testimonialData.content,
      rating: testimonialData.rating,
      achievement: testimonialData.achievement,
      rank: testimonialData.rank,
      year: testimonialData.year,
      userDesignation: testimonialData.userDesignation,
      featured: testimonialData.featured,
      status: testimonialData.status,
      updatedAt: new Date(),
      updatedBy: session.user.id
    };

    const result = await db.collection("testimonials").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// PATCH /api/testimonials/[id] - Partial update (Admin only) for approve/reject/toggle visibility
export async function PATCH(
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
    const db = await getDatabase();

    const updateData: any = { updatedAt: new Date(), updatedBy: session.user.id };

    if (typeof body.status === 'string') {
      updateData.status = body.status;
      if (body.status === 'approved') {
        updateData.approvedBy = session.user.id;
        updateData.approvedAt = new Date();
        updateData.isVisible = true;
      } else if (body.status === 'rejected') {
        updateData.isVisible = false;
      }
    }

    if (typeof body.isVisible === 'boolean') {
      updateData.isVisible = body.isVisible;
    }

    if (typeof body.featured === 'boolean') {
      updateData.featured = body.featured;
    }

    if (Object.keys(updateData).length <= 2) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const result = await db.collection("testimonials").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial (Admin only)
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

    const result = await db.collection("testimonials").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
