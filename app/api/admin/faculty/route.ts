import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();

    // Get all teachers with additional metrics
    const teachers = await db.collection("users").aggregate([
      { $match: { role: "COACH" } },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "teacherId",
          as: "courses"
        }
      },
      {
        $lookup: {
          from: "enrollments",
          let: { teacherId: "$_id" },
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
              }
            },
            { $unwind: "$course" },
            { $match: { $expr: { $eq: ["$course.teacherId", "$$teacherId"] } } }
          ],
          as: "enrollments"
        }
      },
      {
        $lookup: {
          from: "reviews",
          let: { teacherId: "$_id" },
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
              }
            },
            { $unwind: "$course" },
            { $match: { $expr: { $eq: ["$course.teacherId", "$$teacherId"] } } }
          ],
          as: "reviews"
        }
      },
      {
        $addFields: {
          totalCourses: { $size: "$courses" },
          totalStudents: { $size: "$enrollments" },
          rating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0
            }
          },
          isVerified: { $ifNull: ["$isVerified", false] }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          image: 1,
          bio: 1,
          qualifications: 1,
          experience: 1,
          specialization: 1,
          rating: 1,
          totalStudents: 1,
          totalCourses: 1,
          isVerified: 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("Faculty API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new teacher
    const teacherData = {
      name,
      email,
      role: "COACH",
      bio: bio || "",
      qualifications: qualifications || [],
      experience: experience || 0,
      specialization: specialization || [],
      totalStudents: totalStudents || 0,
      rating: rating || 0,
      status: status || "Active",
      isVerified: isVerified !== undefined ? isVerified : true, // Admin-created teachers are verified by default
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("users").insertOne(teacherData);

    if (result.insertedId) {
      const newTeacher = await db.collection("users").findOne(
        { _id: result.insertedId }
      );
      return NextResponse.json({ teacher: newTeacher });
    }

    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Create teacher error:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
