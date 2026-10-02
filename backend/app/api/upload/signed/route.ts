import { NextRequest, NextResponse } from 'next/server';
import { generateSignedUploadParams } from '@/lib/cloudinary';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Signed upload API called');
    
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', session.user.email);

    // Check environment variables
    const requiredEnvVars = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    };
    
    console.log('🌍 Environment variables:', requiredEnvVars);

    const body = await request.json();
    const { folder = 'courses' } = body;

    console.log('📂 Generating signed upload params for folder:', folder);

    // Generate signed upload parameters
    const uploadParams = generateSignedUploadParams(folder);

    console.log('✅ Signed upload parameters generated successfully');
    console.log('🔗 Upload URL will be:', `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`);

    return NextResponse.json({
      success: true,
      uploadParams,
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`
    });

  } catch (error) {
    console.error('❌ Error generating signed upload params:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload parameters' },
      { status: 500 }
    );
  }
}
