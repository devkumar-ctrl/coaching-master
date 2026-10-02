import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/api-guard';

export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    console.log('🔍 Testing Cloudinary configuration...');

    // Check environment variables
    const envVars = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***hidden***' : undefined,
    };

    console.log('📋 Environment variables:', envVars);

    const missingVars = Object.entries(envVars)
      .filter(([key, value]) => !value || value === undefined)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missingVars,
        envVars
      }, { status: 500 });
    }

    // Test Cloudinary connection
    const result = await cloudinary.api.ping();
    console.log('🌤️ Cloudinary ping result:', result);

    return NextResponse.json({
      success: true,
      message: 'Cloudinary configuration is working',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      pingResult: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
