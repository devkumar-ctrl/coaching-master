import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// PATCH /api/admin/courses/[id] - Update course status or other admin fields
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

    const STRING_FIELDS = [
      'title', 'tagline', 'description', 'category', 'duration',
      'level', 'deliveryMode', 'syllabus', 'prerequisites', 'outcomes',
      'materials', 'assessments'
    ] as const;

    const updateData: any = {
      updatedAt: new Date()
    };

    // Full-field edits (admin)
    for (const field of STRING_FIELDS) {
      if (typeof body[field] === 'string') {
        if (field === 'title') {
          if (!body[field].trim()) continue;
          updateData[field] = body[field].trim();
        } else {
          updateData[field] = body[field].trim();
        }
      }
    }

    if (typeof body.price === 'number' && !isNaN(body.price)) {
      updateData.price = body.price;
    } else if (typeof body.price === 'string' && body.price.trim() !== '') {
      updateData.price = parseFloat(body.price) || 0;
    }

    if (typeof body.compareAtPrice === 'number' && !isNaN(body.compareAtPrice)) {
      updateData.compareAtPrice = body.compareAtPrice;
    } else if (typeof body.compareAtPrice === 'string' && body.compareAtPrice.trim() !== '') {
      updateData.compareAtPrice = parseFloat(body.compareAtPrice) || 0;
    }

    if (typeof body.totalClasses !== 'undefined') {
      updateData.totalClasses = parseInt(body.totalClasses) || 0;
    }

    if (typeof body.image === 'string') {
      updateData.image = body.image.trim() || null;
    }

    if (Array.isArray(body.tags)) {
      updateData.tags = body.tags.filter((t: unknown) => typeof t === 'string');
    }

    if (typeof body.featured === 'boolean') {
      updateData.featured = body.featured;
    }

    if (typeof body.status === 'string' && body.status.trim()) {
      updateData.status = body.status.trim().toLowerCase();
    }
    if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;

    if (typeof body.teacherId === 'string' && body.teacherId.trim()) {
      updateData.teacherId = body.teacherId.trim();
    }
    if (typeof body.teacherName === 'string' && body.teacherName.trim()) {
      updateData.teacherName = body.teacherName.trim();
    }

    if (Object.keys(updateData).filter(k => k !== 'updatedAt').length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Log admin activity
    const course = await db.collection("courses").findOne({ _id: new ObjectId(id) });
    
    if (course && updateData.status && updateData.status !== course.status) {
      await db.collection("admin_activities").insertOne({
        type: 'course_status_changed',
        message: `Course "${course.title}" status changed to ${updateData.status}`,
        courseId: id,
        courseName: course.title,
        oldStatus: course.status,
        newStatus: updateData.status,
        adminId: session.user.id,
        adminName: session.user.name,
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      });
    }

    return NextResponse.json({ 
      message: 'Course updated successfully',
      updated: result.modifiedCount > 0 
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[id] - Delete course (admin only)
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

    // Get course details before deletion
    const course = await db.collection("courses").findOne({ _id: new ObjectId(id) });
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course has enrollments
    const enrollmentCount = await db.collection("enrollments")
      .countDocuments({ courseId: id });

    if (enrollmentCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete course with active enrollments. Archive it instead.' 
      }, { status: 400 });
    }

    // Delete course and related data
    await Promise.all([
      db.collection("courses").deleteOne({ _id: new ObjectId(id) }),
      db.collection("reviews").deleteMany({ courseId: id }),
      db.collection("course_meetings").deleteMany({ courseId: id })
    ]);

    // Log admin activity
    await db.collection("admin_activities").insertOne({
      type: 'course_deleted',
      message: `Course "${course.title}" deleted by admin`,
      courseId: id,
      courseName: course.title,
      adminId: session.user.id,
      adminName: session.user.name,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Course deleted successfully',
      deleted: true 
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
