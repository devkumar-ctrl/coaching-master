import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { checkCoupon } from '@/lib/coupons';

export const runtime = 'nodejs';

// POST /api/coupons/validate  { code, courseId }
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, courseId } = await request.json();
    if (!code || !courseId) {
      return NextResponse.json({ error: 'Code and courseId are required' }, { status: 400 });
    }

    const db = await getDatabase();

    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const result = await checkCoupon({
      db,
      code,
      courseId,
      studentId: session.user.id,
      coursePrice: Number(course.price) || 0,
    });

    if (!result.valid) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
