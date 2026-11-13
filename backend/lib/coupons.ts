import { Db } from 'mongodb'

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
  discountPercent: number;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  isFree: boolean;
  courseTitle?: string;
}

// Shared coupon check used by validate + enroll/free + payments
export async function checkCoupon(opts: {
  db: Db;
  code: string;
  courseId: string;
  studentId: string;
  coursePrice: number;
}): Promise<CouponValidationResult> {
  const { db, code, courseId, studentId, coursePrice } = opts;
  const empty: CouponValidationResult = {
    valid: false,
    discountPercent: 0,
    discountAmount: 0,
    originalAmount: coursePrice,
    finalAmount: coursePrice,
    isFree: false,
  };

  const trimmed = (code || '').trim().toUpperCase();
  if (!trimmed) {
    return { ...empty, error: 'Coupon code is required' };
  }

  const coupon = await db.collection('coupons').findOne({ code: trimmed });

  if (!coupon) {
    return { ...empty, error: 'Invalid coupon code' };
  }

  if (coupon.isActive === false) {
    return { ...empty, error: 'This coupon is no longer active' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { ...empty, error: 'This coupon has expired' };
  }

  if (coupon.courseId && coupon.courseId !== courseId) {
    return { ...empty, error: 'This coupon is not valid for this course' };
  }

  if (coupon.maxUses != null && (coupon.usedCount || 0) >= coupon.maxUses) {
    return { ...empty, error: 'This coupon has reached its usage limit' };
  }

  const usedBy = coupon.usedBy || [];
  if (usedBy.some((u: any) => u && u.studentId === studentId)) {
    return { ...empty, error: 'You have already used this coupon' };
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = Math.round((coursePrice * coupon.value) / 100);
  } else {
    discountAmount = Math.min(Number(coupon.value) || 0, coursePrice);
  }

  discountAmount = Math.max(0, Math.min(discountAmount, coursePrice));
  const finalAmount = Math.max(0, coursePrice - discountAmount);
  const discountPercent = coursePrice > 0 ? Math.round((discountAmount / coursePrice) * 100) : 0;

  return {
    valid: true,
    code: trimmed,
    discountPercent,
    discountAmount,
    originalAmount: coursePrice,
    finalAmount,
    isFree: finalAmount === 0,
    courseTitle: coupon.courseTitle || undefined,
  };
}

