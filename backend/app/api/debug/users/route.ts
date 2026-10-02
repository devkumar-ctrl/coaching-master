import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/api-guard';

export const runtime = 'nodejs';

// GET /api/debug/users - Debug endpoint to check users (admin-only)
export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

  const db = await getDatabase();    const users = await db.collection("users")
      .find({}, { projection: { name: 1, email: 1, role: 1, createdAt: 1 } })
      .limit(10)
      .toArray();

    const userCount = await db.collection("users").countDocuments({});
    const roleDistribution = await db.collection("users").aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();

    return NextResponse.json({
      totalUsers: userCount,
      roleDistribution,
      sampleUsers: users.map(user => ({
        ...user,
        _id: user._id.toString()
      }))
    });
  } catch (error) {
    console.error("Debug API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug info", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
