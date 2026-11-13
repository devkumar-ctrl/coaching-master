import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadVideo } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_SIZE = 512 * 1024 * 1024; // 512MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'COACH' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only coaches or admins can upload lessons' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'lessons';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'File must be a video' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Video must be less than 512MB' }, { status: 400 });
    }

    const result = await uploadVideo(file, folder);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload video' },
      { status: 500 }
    );
  }
}
