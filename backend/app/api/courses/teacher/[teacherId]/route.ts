import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";

// GET /api/courses/teacher/[teacherId] - Get all courses by a specific teacher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    
    // Only allow teachers to view their own courses or admins to view any
    if (!session || (session.user?.role !== "COACH" && session.user?.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Teachers can only see their own courses
    if (session.user.role === "COACH" && session.user.id !== resolvedParams.teacherId) {
      return NextResponse.json(
        { error: "You can only view your own courses" },
        { status: 403 }
      );
    }
    
    const db = await getDatabase();

    const courses = await db.collection("courses")
      .find({ teacherId: resolvedParams.teacherId })
      .sort({ createdAt: -1 })
      .toArray();
    
    const coursesWithId = courses.map(course => ({
      id: course._id.toString(),
      ...course,
      _id: undefined
    }));
    
    return NextResponse.json(coursesWithId);
  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
