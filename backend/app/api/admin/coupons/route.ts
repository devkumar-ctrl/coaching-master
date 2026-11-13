import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/admin/coupons - list coupons (optionally filter by courseId)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const query: any = {};
    if (courseId) {
      query.courseId = courseId;
    }

    const coupons = await db.collection('coupons')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const out = coupons.map((c: any) => ({
      id: c._id.toString(),
      code: c.code,
      type: c.type,
      value: c.value,
      courseId: c.courseId,
      courseTitle: c.courseTitle || null,
      maxUses: c.maxUses ?? null,
      usedCount: c.usedCount || 0,
      expiresAt: c.expiresAt || null,
      isActive: c.isActive !== false,
      createdBy: c.createdBy || null,
      createdAt: c.createdAt || null,
      updatedAt: c.updatedAt || null,
    }));

    return NextResponse.json(out);
  } catch (error) {
    console.error('Error listing coupons:', error);
    return NextResponse.json({ error: 'Failed to list coupons' }, { status: 500 });
  }
}

// POST /api/admin/coupons - create coupon
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, type = 'percentage', value, courseId, courseTitle, maxUses, expiresAt, isActive } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const trimmedCode = code.trim().toUpperCase();

    if (trimmedCode.length < 3 || trimmedCode.length > 32) {
      return NextResponse.json({ error: 'Code must be 3-32 characters' }, { status: 400 });
    }

    if (!/^[A-Z0-9_-]+$/.test(trimmedCode)) {
      return NextResponse.json({ error: 'Code may only contain letters, numbers, - and _' }, { status: 400 });
    }

    const numValue = Number(value);
    if (!Number.isFinite(numValue) || numValue <= 0) {
      return NextResponse.json({ error: 'Value must be a positive number' }, { status: 400 });
    }

    if (type !== 'percentage' && type !== 'fixed') {
      return NextResponse.json({ error: 'Type must be percentage or fixed' }, { status: 400 });
    }

    if (type === 'percentage' && numValue > 100) {
      return NextResponse.json({ error: 'Percentage cannot exceed 100' }, { status: 400 });
    }

    if (!courseId) {
      return NextResponse.json({ error: 'Course is required' }, { status: 400 });
    }

    const db = await getDatabase();

    const existing = await db.collection('coupons').findOne({ code: trimmedCode });
    if (existing) {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
    }

    let title = courseTitle || null;
    if (!title) {
      const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
      if (course) title = course.title;
    }

    const now = new Date();
    const doc = {
      code: trimmedCode,
      type,
      value: numValue,
      courseId,
      courseTitle: title,
      maxUses: maxUses == null || maxUses === '' ? null : Number(maxUses),
      usedCount: 0,
      usedBy: [] as any[],
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== false,
      createdBy: session.user.id || null,
      createdAt: now,
      updatedAt: now,
    };

    if (doc.maxUses !== null && (!Number.isFinite(doc.maxUses) || doc.maxUses < 1)) {
      return NextResponse.json({ error: 'Max uses must be a positive number' }, { status: 400 });
    }

    const result = await db.collection('coupons').insertOne(doc);

    return NextResponse.json({
      id: result.insertedId.toString(),
      code: doc.code,
      type: doc.type,
      value: doc.value,
      courseId: doc.courseId,
      courseTitle: doc.courseTitle,
      maxUses: doc.maxUses,
      usedCount: 0,
      expiresAt: doc.expiresAt,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
