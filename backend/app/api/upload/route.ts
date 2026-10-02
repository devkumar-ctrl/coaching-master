import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Server-side upload API called');
    
    // Check environment variables first
    const requiredEnvVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY', 
      'CLOUDINARY_API_SECRET'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      console.error('❌ Missing environment variables:', missingEnvVars);
      return NextResponse.json({ 
        error: 'Server configuration error: Missing Cloudinary environment variables',
        details: `Missing: ${missingEnvVars.join(', ')}`,
        missingEnvVars
      }, { status: 500 });
    }
    
    console.log('✅ Environment variables check passed');
    
    const session = await auth();
    
    if (!session?.user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', session.user.email);

    // Check if user is a COACH or ADMIN
    if (session.user.role !== 'COACH' && session.user.role !== 'ADMIN') {
      console.log('❌ User is not allowed to upload:', session.user.role);
      return NextResponse.json({ error: 'Only coaches or admins can upload images' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'courses';

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('📸 File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2),
      folder
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size, 'bytes');
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Upload to Cloudinary
    console.log('🌤️ Uploading to Cloudinary...');
    const imageUrl = await uploadImage(file, folder);
    
    console.log('✅ Upload successful:', imageUrl);

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Image uploaded successfully' 
    });

  } catch (error) {
    console.error('❌ Error uploading image:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to upload image';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }
    
    // Check if it's a Cloudinary-specific error
    if (error && typeof error === 'object' && 'http_code' in error) {
      const cloudinaryError = error as any;
      console.error('🌤️ Cloudinary error details:', {
        http_code: cloudinaryError.http_code,
        message: cloudinaryError.message,
        error: cloudinaryError.error
      });
      
      return NextResponse.json({
        error: 'Cloudinary upload failed',
        message: cloudinaryError.message || errorMessage,
        http_code: cloudinaryError.http_code,
        details: errorDetails
      }, { status: 500 });
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
