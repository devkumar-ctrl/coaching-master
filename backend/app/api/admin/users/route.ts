import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { hashPassword } from "@/lib/password";

export const runtime = 'nodejs';

// GET /api/admin/users - Get all users with enriched data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    const users = await db.collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich user data with additional information
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const baseUser = {
          ...user,
          _id: user._id.toString(),
          isVerified: user.isVerified || false
        };

        if (user.role === 'COACH') {
          // Get teacher-specific stats
          const [courseCount, enrollments] = await Promise.all([
            db.collection("courses").countDocuments({ teacherId: user._id.toString() }),
            db.collection("enrollments").find({ teacherId: user._id.toString() }).toArray()
          ]);

          const totalStudents = new Set(enrollments.map(e => e.studentId)).size;

          return {
            ...baseUser,
            totalCourses: courseCount,
            totalStudents
          };
        } else if (user.role === 'STUDENT') {
          // Get student-specific stats
          const enrollments = await db.collection("enrollments")
            .find({ studentId: user._id.toString() })
            .toArray();

          const completedCourses = enrollments.filter(e => e.status === 'completed').length;

          return {
            ...baseUser,
            enrolledCourses: enrollments.length,
            completedCourses
          };
        }

        return baseUser;
      })
    );

    return NextResponse.json(enrichedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await request.json();
    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: userData.email
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const newUser: Record<string, unknown> = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'STUDENT',
      specialization: userData.specialization || [],
      status: 'active',
      isVerified: true,
      createdAt: new Date(),
      createdBy: session.user.id,
      updatedAt: new Date()
    };

    // If a password is provided, hash and store it so the user can log in
    if (userData.password) {
      newUser.passwordHash = hashPassword(userData.password);
    }

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json({
      message: 'User created successfully',
      userId: newUser.id
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only admins can update users
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      userId, 
      name,
      email,
      role, 
      isVerified, 
      status,
      specialization,
      qualifications,
      experience,
      bio,
      phone,
      location,
      image
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (role && !["STUDENT", "COACH", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT, COACH, or ADMIN" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get current user data
    const currentUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: session.user.id
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) {
      updateData.role = role;
      updateData.roleUpdatedAt = new Date();
      updateData.roleUpdatedBy = session.user.id;
    }
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (status) updateData.status = status;
    if (image !== undefined) updateData.image = image;

    // Role-specific fields
    if (role === 'COACH' || currentUser.role === 'COACH') {
      if (specialization !== undefined) updateData.specialization = specialization;
      if (qualifications !== undefined) updateData.qualifications = qualifications;
      if (experience !== undefined) updateData.experience = experience;
      if (bio !== undefined) updateData.bio = bio;
      if (phone !== undefined) updateData.phone = phone;
      if (location !== undefined) updateData.location = location;
      
      // Initialize coach-specific fields if becoming a coach
      if (role === 'COACH' && currentUser.role !== 'COACH') {
        updateData.rating = 0;
        updateData.totalStudents = 0;
        updateData.totalCourses = 0;
        updateData.totalReviews = 0;
        updateData.socialLinks = {};
      }
    }
    
    // Update user
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Add to admin activity log
    const activityMessage = role && role !== currentUser.role 
      ? `User role updated: ${currentUser.name} (${currentUser.role} → ${role})`
      : `User updated: ${currentUser.name}`;

    await db.collection("admin_activities").insertOne({
      type: role && role !== currentUser.role ? 'role_changed' : 'user_updated',
      message: activityMessage,
      userId: userId,
      userName: currentUser.name,
      userEmail: currentUser.email,
      oldRole: currentUser.role,
      newRole: role || currentUser.role,
      adminId: session.user.id,
      adminName: session.user.name,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });

    // Get updated user data
    const updatedUser = await db.collection("users").findOne(
      { _id: new ObjectId(userId) }
    );

    return NextResponse.json({
      success: true,
      message: role && role !== currentUser.role 
        ? `User role updated to ${role}`
        : 'User updated successfully',
      user: {
        ...updatedUser,
        _id: updatedUser?._id.toString()
      }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
