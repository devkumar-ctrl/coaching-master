import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export const runtime = 'nodejs';

// PUT /api/admin/faculty/[id] - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const {
      name,
      email,
      bio,
      qualifications,
      experience,
      specialization,
      totalStudents,
      rating,
      status,
      isVerified
    } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if teacher exists
    const teacherExists = await db.collection("users").findOne({ 
      _id: new ObjectId(id),
      role: "COACH"
    });

    if (!teacherExists) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await db.collection("users").findOne({ 
      email,
      _id: { $ne: new ObjectId(id) }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken by another user" },
        { status: 400 }
      );
    }

    // Update teacher data
    const updateData = {
      name,
      email,
      bio: bio || "",
      qualifications: qualifications || [],
      experience: experience || 0,
      specialization: specialization || [],
      totalStudents: totalStudents || 0,
      rating: rating || 0,
      status: status || "Active",
      isVerified: isVerified !== undefined ? isVerified : true,
      updatedAt: new Date()
    };

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Get updated teacher data
    const updatedTeacher = await db.collection("users").findOne(
      { _id: new ObjectId(id) }
    );

    return NextResponse.json({ 
      message: "Teacher updated successfully",
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error("Update teacher error:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/faculty/[id] - Delete teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();

    // Check if teacher exists
    const teacher = await db.collection("users").findOne({ 
      _id: new ObjectId(id),
      role: "COACH"
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Check if teacher has any courses
    const courseCount = await db.collection("courses").countDocuments({ 
      teacherId: id 
    });

    if (courseCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete teacher with existing courses. Archive teacher instead." },
        { status: 400 }
      );
    }

    // Delete teacher
    const result = await db.collection("users").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Log admin activity
    await db.collection("admin_activities").insertOne({
      type: 'teacher_deleted',
      message: `Teacher "${teacher.name}" deleted by admin`,
      teacherId: id,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      adminId: session.user.id,
      adminName: session.user.name,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: "Teacher deleted successfully" 
    });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
