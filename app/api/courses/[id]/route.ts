import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// GET /api/courses/[id] - Get a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDatabase();
    const resolvedParams = await params;
    
    const course = await db.collection("courses")
      .findOne({ _id: new ObjectId(resolvedParams.id) });
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: course._id.toString(),
      ...course
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course (only by the course creator)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "COACH") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const db = await getDatabase();
    
    // Check if the course exists and belongs to the user
    const existingCourse = await db.collection("courses")
      .findOne({ _id: new ObjectId(id), teacherId: session.user.id });
    
    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course (only by the course creator)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "COACH") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const db = await getDatabase();
    
    // Check if the course exists and belongs to the user
    const existingCourse = await db.collection("courses")
      .findOne({ _id: new ObjectId(id), teacherId: session.user.id });
    
    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }
    
    const result = await db.collection("courses").deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
