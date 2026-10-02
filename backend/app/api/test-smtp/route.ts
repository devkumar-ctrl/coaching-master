import { NextRequest, NextResponse } from 'next/server';
import { testSMTPConnection } from '@/lib/email';
import { requireAdmin } from '@/lib/api-guard';

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    console.log('🔍 Testing Gmail SMTP connection...');
    const result = await testSMTPConnection();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Gmail SMTP connection successful!' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Gmail SMTP connection failed',
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test Gmail SMTP error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error testing Gmail SMTP connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
