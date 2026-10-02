import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: Promise<{ teacherId: string }> }) {
  try {
    const session = await auth()
    const resolvedParams = await params
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()

    // Get teacher profile
    const teacher = await db.collection("users").findOne({ 
      _id: new ObjectId(resolvedParams.teacherId),
      role: "COACH"
    })
    
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    // Only allow teachers to view their own profile or admins
    if (session.user.role !== "ADMIN" && session.user.id !== resolvedParams.teacherId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      image: teacher.image,
      role: teacher.role,
      qualifications: teacher.qualifications || [],
      bio: teacher.bio || '',
      specialization: teacher.specialization || [],
      experience: teacher.experience || '',
      phone: teacher.phone || '',
      location: teacher.location || '',
      achievements: teacher.achievements || [],
      languages: teacher.languages || ['English'],
      rating: teacher.rating || 0,
      totalStudents: teacher.totalStudents || 0,
      totalCourses: teacher.totalCourses || 0,
      joinedAt: teacher.createdAt || teacher.joinedAt,
      isVerified: teacher.isVerified || false,
      socialLinks: teacher.socialLinks || {}
    })
  } catch (error) {
    console.error('Error fetching teacher profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teacher profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ teacherId: string }> }) {
  return updateTeacherProfile(request, { params });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ teacherId: string }> }) {
  return updateTeacherProfile(request, { params });
}

async function updateTeacherProfile(request: NextRequest, { params }: { params: Promise<{ teacherId: string }> }) {
  try {
    const session = await auth()
    const resolvedParams = await params
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow teachers to update their own profile
    if (session.user.role !== "COACH" || session.user.id !== resolvedParams.teacherId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      bio,
      qualifications,
      specialization,
      experience,
      phone,
      location,
      achievements,
      languages,
      socialLinks,
      image
    } = body

    const db = await getDatabase()
    
    // Update teacher profile
    const updateData: any = {
      updatedAt: new Date()
    }

    if (name) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (qualifications) updateData.qualifications = qualifications
    if (specialization) updateData.specialization = specialization
    if (experience !== undefined) updateData.experience = experience
    if (phone !== undefined) updateData.phone = phone
    if (location !== undefined) updateData.location = location
    if (achievements) updateData.achievements = achievements
    if (languages) updateData.languages = languages
    if (socialLinks) updateData.socialLinks = socialLinks
    if (image !== undefined) updateData.image = image

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(resolvedParams.teacherId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    // Update teacher info in all courses
    if (name) {
      await db.collection("courses").updateMany(
        { teacherId: resolvedParams.teacherId },
        { $set: { teacherName: name } }
      )
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      updated: result.modifiedCount > 0
    })
  } catch (error) {
    console.error('Error updating teacher profile:', error)
    return NextResponse.json(
      { error: 'Failed to update teacher profile' },
      { status: 500 }
    )
  }
}
