import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/admin/users/[id] - Get specific user details
export async function GET(
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

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Enrich with role-specific data
    let enrichedUser: any = {
      ...user,
      _id: user._id.toString()
    };

    if (user.role === 'COACH') {
      const [courseCount, enrollments, reviews] = await Promise.all([
        db.collection("courses").countDocuments({ teacherId: user._id.toString() }),
        db.collection("enrollments").find({ teacherId: user._id.toString() }).toArray(),
        db.collection("reviews").find({ teacherId: user._id.toString() }).toArray()
      ]);

      const totalStudents = new Set(enrollments.map(e => e.studentId)).size;
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      enrichedUser = {
        ...enrichedUser,
        totalCourses: courseCount,
        totalStudents,
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10
      };
    } else if (user.role === 'STUDENT') {
      const [enrollments, payments] = await Promise.all([
        db.collection("enrollments").find({ studentId: user._id.toString() }).toArray(),
        db.collection("payments").find({ 
          studentId: user._id.toString(), 
          status: 'COMPLETED' 
        }).toArray()
      ]);

      const totalSpent = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      enrichedUser = {
        ...enrichedUser,
        totalEnrollments: enrollments.length,
        totalSpent,
        totalPayments: payments.length
      };
    }

    return NextResponse.json(enrichedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user details (admin only)
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
    const { role, isVerified, name, email } = body;

    const db = await getDatabase();

    const updateData: any = {
      updatedAt: new Date()
    };

    if (role) updateData.role = role;
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log admin activity
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    
    if (user) {
      await db.collection("admin_activities").insertOne({
        type: 'user_updated',
        message: `User "${user.name}" updated by admin`,
        userId: id,
        userName: user.name,
        changes: updateData,
        adminId: session.user.id,
        adminName: session.user.name,
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      });
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      updated: result.modifiedCount > 0 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user (admin only)
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

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const db = await getDatabase();

    // Get user details before deletion
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has active enrollments or courses
    const [enrollmentCount, courseCount] = await Promise.all([
      db.collection("enrollments").countDocuments({ studentId: id }),
      db.collection("courses").countDocuments({ teacherId: id })
    ]);

    if (enrollmentCount > 0 || courseCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete user with active enrollments or courses. Archive user instead.' 
      }, { status: 400 });
    }

    // Delete user and related data
    await Promise.all([
      db.collection("users").deleteOne({ _id: new ObjectId(id) }),
      db.collection("reviews").deleteMany({ studentId: id }),
      db.collection("payments").deleteMany({ studentId: id })
    ]);

    // Log admin activity
    await db.collection("admin_activities").insertOne({
      type: 'user_deleted',
      message: `User "${user.name}" deleted by admin`,
      userId: id,
      userName: user.name,
      userEmail: user.email,
      adminId: session.user.id,
      adminName: session.user.name,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deleted: true 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
