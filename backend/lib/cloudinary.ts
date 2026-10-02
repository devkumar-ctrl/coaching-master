import { v2 as cloudinary } from 'cloudinary';

// Check for required environment variables
const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// Log environment variable status
console.log('🌤️ Cloudinary environment variables check:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🌤️ Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);

export default cloudinary;

// Helper function to generate signed upload parameters
export const generateSignedUploadParams = (folder: string = 'courses') => {
  console.log('🔐 Generating signed upload parameters for folder:', folder);
  
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Simplified parameters - only the essentials for signed upload
  const params = {
    timestamp: timestamp.toString(),
    folder: `coaching/${folder}`,
  };

  console.log('📝 Generated upload params:', params);
  
  // Generate signature using only the essential params
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  
  console.log('✍️ Generated signature for upload');
  console.log('🔍 Signature details:', { 
    signature: signature.substring(0, 10) + '...', 
    timestamp,
    folder: params.folder 
  });
  
  return {
    timestamp: params.timestamp,
    folder: params.folder,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  };
};

// Helper function to upload image using signed upload
export async function uploadImage(file: File | string, folder: string = 'courses'): Promise<string> {
  try {
    console.log('📤 Starting image upload to folder:', folder);
    
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is incomplete. Please check environment variables.');
    }
    
    let uploadResult;
    
    if (typeof file === 'string') {
      console.log('📄 Uploading from base64/URL string');
      // If file is a base64 string or URL
      uploadResult = await cloudinary.uploader.upload(file, {
        folder: `coaching/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
    } else {
      console.log('📎 Uploading File object, size:', file.size, 'bytes');
      // If file is a File object, convert to base64 first
      const base64 = await fileToBase64(file);
      console.log('🔄 Converted file to base64');
      uploadResult = await cloudinary.uploader.upload(base64, {
        folder: `coaching/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
    }
    
    console.log('✅ Image uploaded successfully:', {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      resource_type: uploadResult.resource_type
    });
    
    return uploadResult.secure_url;
  } catch (error) {
    console.error('❌ Error uploading image to Cloudinary:', error);
    
    // Provide more specific error information
    if (error && typeof error === 'object' && 'http_code' in error) {
      const cloudinaryError = error as any;
      console.error('🌤️ Cloudinary API Error:', {
        http_code: cloudinaryError.http_code,
        message: cloudinaryError.message,
        error: cloudinaryError.error?.type || cloudinaryError.error
      });
      throw new Error(`Cloudinary Error (${cloudinaryError.http_code}): ${cloudinaryError.message || 'Upload failed'}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    throw new Error('Failed to upload image to Cloudinary');
  }
}

// Helper function to delete image
export async function deleteImage(publicId: string): Promise<void> {
  try {
    console.log('🗑️ Attempting to delete image with publicId:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('✅ Image deletion result:', result);
  } catch (error) {
    console.error('❌ Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

// Helper function to convert File to base64 (Node.js compatible)
async function fileToBase64(file: File): Promise<string> {
  console.log('🔄 Converting file to base64, size:', file.size, 'bytes');
  
  try {
    // Convert File to ArrayBuffer, then to Buffer, then to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    console.log('✅ File converted to base64 successfully');
    return base64;
  } catch (error) {
    console.error('❌ Error converting file to base64:', error);
    throw new Error('Failed to convert file to base64');
  }
}

// Helper function to extract public ID from Cloudinary URL
export function getPublicIdFromUrl(url: string): string {
  console.log('🔍 Extracting public ID from URL:', url);
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const publicId = lastPart.split('.')[0];
  console.log('📋 Extracted public ID:', publicId);
  return publicId;
}

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: any = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };
  
  const url = cloudinary.url(publicId, defaultOptions);
  console.log('🖼️ Generated optimized image URL:', url);
  return url;
};
