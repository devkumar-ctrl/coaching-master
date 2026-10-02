import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/testimonials - Get all testimonials for public display or admin management
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const admin = searchParams.get('admin') === 'true';

    // Build query
    let query: any = {};
    if (status) {
      query.status = status;
    }

    const testimonials = await db.collection("testimonials")
      .find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit || 0)
      .toArray();

    if (admin) {
      // Return raw data for admin with proper field mapping
      const adminTestimonials = testimonials.map(testimonial => ({
        _id: testimonial._id.toString(),
        name: testimonial.name || testimonial.userName || 'Unknown User',
        email: testimonial.email || testimonial.userEmail || '',
        image: testimonial.image || testimonial.userImage || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        status: testimonial.status || 'pending',
        isVisible: testimonial.isVisible !== false,
        position: testimonial.position || '',
        company: testimonial.company || '',
        location: testimonial.location || '',
        createdAt: testimonial.createdAt || new Date().toISOString(),
        updatedAt: testimonial.updatedAt || new Date().toISOString(),
        approvedBy: testimonial.approvedBy,
        approvedAt: testimonial.approvedAt
      }));
      return NextResponse.json(adminTestimonials);
    }

    // Enrich with user details for public display
    const enrichedTestimonials = await Promise.all(
      testimonials.map(async (testimonial) => {
        // Try to get user from database if userId exists
        let user = null;
        if (testimonial.userId) {
          user = await db.collection("users").findOne({
            id: testimonial.userId
          });
        }

        return {
          id: testimonial._id.toString(),
          content: testimonial.content,
          rating: testimonial.rating || 5,
          featured: testimonial.featured,
          status: testimonial.status,
          createdAt: testimonial.createdAt,
          name: testimonial.name || user?.name || 'Anonymous',
          image: testimonial.image || user?.image || '',
          user: {
            id: user?.id || testimonial.userId,
            name: testimonial.name || user?.name || 'Anonymous',
            image: testimonial.image || user?.image || '',
            designation: testimonial.position || testimonial.userDesignation || 'Tech Student'
          },
          achievement: testimonial.achievement,
          rank: testimonial.rank,
          year: testimonial.year
        };
      })
    );

    return NextResponse.json(enrichedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create new testimonial (Admin only) or submit for review (Users)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testimonialData = await request.json();
    const db = await getDatabase();

    const testimonial = {
      name: testimonialData.name || session.user.name,
      email: testimonialData.email || session.user.email,
      image: testimonialData.image || session.user.image,
      content: testimonialData.content,
      rating: testimonialData.rating || 5,
      position: testimonialData.position || '',
      company: testimonialData.company || '',
      location: testimonialData.location || '',
      isVisible: testimonialData.isVisible !== undefined ? testimonialData.isVisible : true,
      userId: testimonialData.userId || session.user.id,
      achievement: testimonialData.achievement,
      rank: testimonialData.rank,
      year: testimonialData.year,
      userDesignation: testimonialData.userDesignation,
      featured: session.user.role === 'ADMIN' ? testimonialData.featured || false : false,
      status: session.user.role === 'ADMIN' ? (testimonialData.status || 'approved') : 'pending',
      createdAt: new Date(),
      createdBy: session.user.id,
      updatedAt: new Date()
    };

    const result = await db.collection("testimonials").insertOne(testimonial);

    return NextResponse.json({
      message: session.user.role === 'ADMIN' 
        ? 'Testimonial created successfully' 
        : 'Testimonial submitted for review',
      testimonialId: result.insertedId.toString()
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
