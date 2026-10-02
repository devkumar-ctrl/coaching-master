import { NextRequest, NextResponse } from 'next/server';
import { sendEnrollmentConfirmation, sendWelcomeEmail } from '@/lib/email';
import { requireAdmin } from '@/lib/api-guard';

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { type, email, name } = await request.json();

    if (type === 'welcome') {
      const result = await sendWelcomeEmail(name || 'Test User', email);
      return NextResponse.json(result);
    } else if (type === 'enrollment') {
      const result = await sendEnrollmentConfirmation({
        studentName: name || 'Test Student',
        studentEmail: email,
        courseTitle: 'Test Course - Cyber Security',
        teacherName: 'Test Instructor',
        enrollmentDate: new Date(),
        courseId: 'test-course-123',
        paymentId: 'test-payment-456'
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
