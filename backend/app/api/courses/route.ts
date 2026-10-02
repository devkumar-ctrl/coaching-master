import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// GET /api/courses - Fetch courses with query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const status = searchParams.get("status") || "published";
    
    const db = await getDatabase();
    
    // Use aggregation to join with users collection to get teacher info
    const pipeline = [
      { $match: { status } },
      {
        $addFields: {
          teacherObjectId: {
            $convert: {
              input: "$teacherId",
              to: "objectId",
              onNull: null,
              onError: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "teacherObjectId",
          foreignField: "_id",
          as: "teacherFromDb"
        }
      },
      {
        $addFields: {
          teacher: {
            $cond: {
              if: { $gt: [{ $size: "$teacherFromDb" }, 0] },
              then: {
                name: { $arrayElemAt: ["$teacherFromDb.name", 0] },
                email: { $arrayElemAt: ["$teacherFromDb.email", 0] },
                image: { $arrayElemAt: ["$teacherFromDb.image", 0] },
                photo: { $arrayElemAt: ["$teacherFromDb.photo", 0] }
              },
              else: {
                name: { $ifNull: ["$teacherName", "Expert Faculty"] },
                email: "$teacherEmail",
                image: null,
                photo: null
              }
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          price: 1,
          duration: 1,
          level: 1,
          deliveryMode: 1,
          totalClasses: 1,
          syllabus: 1,
          prerequisites: 1,
          outcomes: 1,
          materials: 1,
          assessments: 1,
          tags: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          enrollmentCount: { $ifNull: ["$enrolledCount", 0] },
          image: 1,
          teacher: 1
        }
      }
    ];

    // Apply sorting
    const sortOrder = order === "desc" ? -1 : 1;
    pipeline.push({ $sort: { [sort]: sortOrder } } as any);
    
    // Apply limit if specified
    if (limit) {
      pipeline.push({ $limit: parseInt(limit) } as any);
    }
    
    const courses = await db.collection("courses").aggregate(pipeline).toArray();
    
    // Convert _id to id for frontend compatibility
    const coursesWithId = courses.map(course => ({
      ...course,
      id: course._id.toString(),
      // Ensure teacher field exists even if no teacher found
      teacher: course.teacher || {
        name: "Expert Faculty",
        image: "/logo.jpg",
        email: null
      }
    }));
    
    return NextResponse.json(coursesWithId);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (COACH only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is a COACH
    if (!session || session.user?.role !== "COACH") {
      return NextResponse.json(
        { error: "Unauthorized. Only coaches can create courses." },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      price, 
      duration, 
      level, 
      deliveryMode,
      totalClasses,
      syllabus,
      prerequisites,
      outcomes,
      materials,
      assessments,
      tags,
      status,
      image 
    } = body;
    
    // Validate required fields
    if (!title || !description || !category || !duration || !level || !deliveryMode || !totalClasses) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    const courseData = {
      title,
      description,
      category,
      price: parseFloat(price) || 0,
      duration,
      level,
      deliveryMode,
      totalClasses: parseInt(totalClasses) || 0,
      syllabus: syllabus || "",
      prerequisites: prerequisites || "",
      outcomes: outcomes || "",
      materials: materials || "",
      assessments: assessments || "",
      tags: tags || [],
      image: image || null,
      teacherId: session.user.id,
      teacherName: session.user.name,
      teacherEmail: session.user.email,
      enrolledStudents: [],
      enrolledCount: 0,
      status: status || "draft", // Use provided status or default to draft
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("courses").insertOne(courseData);
    
    const createdCourse = {
      id: result.insertedId.toString(),
      ...courseData
    };
    
    return NextResponse.json(createdCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
