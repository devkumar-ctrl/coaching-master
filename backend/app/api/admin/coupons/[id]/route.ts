import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// PUT /api/admin/coupons/[id] - update coupon (toggle active, change usage limit / expiry)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon id' }, { status: 400 });
    }

    const body = await request.json();
    const updates: any = { updatedAt: new Date() };

    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
    if (body.maxUses !== undefined) {
      if (body.maxUses === null || body.maxUses === '') {
        updates.maxUses = null;
      } else {
        const n = Number(body.maxUses);
        if (!Number.isFinite(n) || n < 1) {
          return NextResponse.json({ error: 'Max uses must be a positive number or empty' }, { status: 400 });
        }
        updates.maxUses = n;
      }
    }
    if (body.expiresAt !== undefined) {
      updates.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }
    if (body.value !== undefined) {
      const n = Number(body.value);
      if (!Number.isFinite(n) || n <= 0) {
        return NextResponse.json({ error: 'Value must be a positive number' }, { status: 400 });
      }
      updates.value = n;
    }

    const result = await db.collection('coupons').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

// DELETE /api/admin/coupons/[id] - delete coupon
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon id' }, { status: 400 });
    }

    const result = await db.collection('coupons').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
