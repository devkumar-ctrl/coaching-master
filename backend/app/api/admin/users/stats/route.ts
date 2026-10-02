import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/users/stats - Get user statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Get user counts by role and verification status
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      verifiedUsers,
      unverifiedUsers,
      newUsersThisMonth
    ] = await Promise.all([
      db.collection("users").countDocuments({}),
      db.collection("users").countDocuments({ role: 'STUDENT' }),
      db.collection("users").countDocuments({ role: 'COACH' }),
      db.collection("users").countDocuments({ role: 'ADMIN' }),
      db.collection("users").countDocuments({ isVerified: true }),
      db.collection("users").countDocuments({ isVerified: false }),
      db.collection("users").countDocuments({
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      })
    ]);

    // Calculate active users (logged in within last 30 days)
    const activeUsers = await db.collection("users").countDocuments({
      lastLoginAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    });

    const stats = {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      verifiedUsers,
      unverifiedUsers,
      activeUsers,
      newUsersThisMonth
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}
