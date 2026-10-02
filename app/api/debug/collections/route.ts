import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/api-guard';

export const runtime = 'nodejs';

// GET /api/debug/collections - Debug endpoint to check database collections
export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const db = await getDatabase();

    // List all collections
    const collections = await db.listCollections().toArray();
    
    // Get counts for each collection
    const collectionStats = await Promise.all(
      collections.map(async (collection) => {
        const count = await db.collection(collection.name).countDocuments({});
        return {
          name: collection.name,
          count
        };
      })
    );

    return NextResponse.json({
      database: 'coaching',
      collections: collectionStats
    });
  } catch (error) {
    console.error("Debug Collections API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
