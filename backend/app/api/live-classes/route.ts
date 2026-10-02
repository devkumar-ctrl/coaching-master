import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendLiveClassNotification } from '@/lib/email';
import { ObjectId } from 'mongodb';

// Helper to send email notifications to enrolled students
async function sendEmailNotificationsToStudents(classDetails: {
  courseId: string;
  courseTitle: string;
  teacherName: string;
  classTitle: string;
  meetingLink: string;
  startTime: Date;
}) {
  try {
    const db = await getDatabase();
    
    console.log('🔍 Looking for enrollments for course:', classDetails.courseId);
    
    // Find all enrolled students for this course
    const enrollments = await db.collection('enrollments').find({
      courseId: classDetails.courseId,
      status: 'active'
    }).toArray();

    console.log('📊 Found enrollments:', enrollments.length);
    console.log('📋 Enrollments details:', enrollments.map(e => ({ 
      studentId: e.studentId, 
      courseId: e.courseId, 
      status: e.status 
    })));

    if (enrollments.length === 0) {
      console.log('❌ No enrolled students found for course:', classDetails.courseId);
      return;
    }

    // Get student details - handle both string and ObjectId formats
    const studentIds = enrollments.map((enrollment: any) => enrollment.studentId);

    console.log('🔍 Looking for students with IDs:', studentIds);

    // Try both string and ObjectId formats
    const students = await db.collection('users').find({
      $and: [
        {
          $or: [
            { _id: { $in: studentIds } }, // Try as strings first
            { _id: { $in: studentIds.map((id: any) => {
              try {
                return typeof id === 'string' ? new ObjectId(id) : id;
              } catch {
                return id;
              }
            }) } } // Try as ObjectIds
          ]
        },
        {
          $or: [
            { role: 'student' },
            { role: 'STUDENT' }
          ]
        }
      ]
    }).toArray();

    // Debug: Let's check if users exist without role filter
    const allMatchingUsers = await db.collection('users').find({
      $or: [
        { _id: { $in: studentIds } },
        { _id: { $in: studentIds.map((id: any) => {
          try {
            return typeof id === 'string' ? new ObjectId(id) : id;
          } catch {
            return id;
          }
        }) } }
      ]
    }).toArray();

    console.log('🔍 All matching users (no role filter):', allMatchingUsers.map(u => ({ 
      id: u._id, 
      type: typeof u._id, 
      role: u.role, 
      email: u.email 
    })));

    console.log('👥 Found students:', students.length);
    console.log('📧 Students to notify:', students.map(s => ({ 
      id: s._id, 
      name: s.name, 
      email: s.email 
    })));

    if (students.length === 0) {
      console.log('❌ No student users found for the enrolled student IDs');
      return;
    }

    console.log(`📤 Sending live class notifications to ${students.length} students`);

    // Send email to each student
    const emailPromises = students.map((student: any) => 
      sendLiveClassNotification({
        studentEmail: student.email,
        studentName: student.name,
        courseTitle: classDetails.courseTitle,
        teacherName: classDetails.teacherName,
        classTitle: classDetails.classTitle,
        meetingLink: classDetails.meetingLink,
        startTime: classDetails.startTime
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Email notifications sent successfully to ${successful} students`);
    if (failed > 0) {
      console.log(`❌ Failed to send ${failed} email notifications`);
    }
    
  } catch (error) {
    console.error('💥 Error sending email notifications:', error);
    throw error;
  }
}

// Database collections and interfaces
const LIVE_CLASSES_COLLECTION = 'liveClasses';

interface LiveClassDocument {
  _id?: any;
  id: string;
  teacherId: string;
  teacherName: string;
  courseId?: string;
  courseTitle?: string;
  title: string;
  meetingLink: string;
  platform: string;
  publishedAt: Date;
  isActive: boolean;
  expectedDuration?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const {
      teacherId,
      teacherName,
      courseId,
      courseTitle,
      title,
      meetingLink,
      platform = 'other',
      expectedDuration = 60,
      description
    } = await request.json();

    // Validation
    if (!teacherId || !teacherName || !title || !meetingLink) {
      return NextResponse.json(
        { error: 'Missing required fields: teacherId, teacherName, title, meetingLink' },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course selection is required for live classes' },
        { status: 400 }
      );
    }

    // Validate meeting link format
    if (!isValidMeetingLink(meetingLink)) {
      return NextResponse.json(
        { error: 'Invalid meeting link format' },
        { status: 400 }
      );
    }

    const classId = `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const liveClassDoc: LiveClassDocument = {
      id: classId,
      teacherId,
      teacherName,
      courseId,
      courseTitle,
      title,
      meetingLink,
      platform: detectPlatform(meetingLink) || platform,
      publishedAt: now,
      isActive: true,
      expectedDuration,
      description,
      createdAt: now,
      updatedAt: now
    };

    // Save to database
    const db = await getDatabase();
    const result = await db.collection(LIVE_CLASSES_COLLECTION).insertOne(liveClassDoc);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to save live class to database' },
        { status: 500 }
      );
    }

    // Send email notifications to enrolled students
    try {
      await sendEmailNotificationsToStudents({
        courseId,
        courseTitle,
        teacherName,
        classTitle: title,
        meetingLink,
        startTime: now
      });
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
      // Don't fail the live class creation if emails fail
    }

    // Return the created live class (format for frontend compatibility)
    const responseClass = {
      id: classId,
      teacherId,
      teacherName,
      courseId,
      courseTitle,
      title,
      meetingLink,
      platform: liveClassDoc.platform,
      publishedAt: now.toISOString(),
      isActive: true,
      expectedDuration,
      description
    };

    return NextResponse.json({
      success: true,
      liveClass: responseClass,
      message: 'Live class published successfully and email notifications sent to enrolled students'
    });

  } catch (error) {
    console.error('Error publishing live class:', error);
    return NextResponse.json(
      { error: 'Failed to publish live class' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const teacherId = url.searchParams.get('teacherId');
    const studentId = url.searchParams.get('studentId');
    
    // Get all courseId parameters (there might be multiple)
    const courseIds = url.searchParams.getAll('courseId').filter(id => id && id.trim());

    console.log('🔍 GET /api/live-classes');
    console.log('👨‍🏫 Teacher ID:', teacherId);
    console.log('👨‍🎓 Student ID:', studentId);
    console.log('📚 Course IDs:', courseIds);

    const db = await getDatabase();
    
    // Build query for active live classes
    let query: any = { isActive: true };
    
    // Filter by teacher
    if (teacherId) {
      query.teacherId = teacherId;
      console.log('🎯 Filtering by teacher:', teacherId);
    }

    // Filter by specific courses (when courseIds are provided)
    if (courseIds.length > 0) {
      query.$or = [
        { courseId: { $in: courseIds } },
        { courseId: { $exists: false } }, // Show general classes too
        { courseId: null }
      ];
      console.log('🎯 Filtering by courses:', courseIds);
    }

    // If studentId is provided but no specific courseIds, get their enrolled courses
    if (studentId && courseIds.length === 0) {
      console.log('🔍 Looking up enrolled courses for student:', studentId);
      
      const enrollments = await db.collection('enrollments').find({
        studentId: studentId,
        status: 'active'
      }).toArray();
      
      const enrolledCourseIds = enrollments.map((e: any) => e.courseId);
      console.log('📚 Student enrolled courses:', enrolledCourseIds);
      
      if (enrolledCourseIds.length > 0) {
        query.$or = [
          { courseId: { $in: enrolledCourseIds } },
          { courseId: { $exists: false } }, // Show general classes too
          { courseId: null }
        ];
        console.log('🎯 Filtering by enrolled courses:', enrolledCourseIds);
      } else {
        console.log('❌ Student has no enrolled courses - returning empty result');
        // Student has no enrollments, return empty array instead of all classes
        return NextResponse.json({
          success: true,
          liveClasses: [],
          count: 0,
          message: 'No live classes available. Please enroll in courses to see live classes.'
        });
      }
    }

    console.log('🔍 Final MongoDB query:', JSON.stringify(query, null, 2));

    // Fetch from database and sort by most recent
    const liveClasses = await db.collection(LIVE_CLASSES_COLLECTION)
      .find(query)
      .sort({ publishedAt: -1 })
      .toArray();

    console.log('📦 Found live classes:', liveClasses.length);

    // Format for frontend compatibility
    const filteredClasses = liveClasses.map((doc: any) => ({
      id: doc.id,
      teacherId: doc.teacherId,
      teacherName: doc.teacherName,
      courseId: doc.courseId,
      courseTitle: doc.courseTitle,
      title: doc.title,
      meetingLink: doc.meetingLink,
      platform: doc.platform,
      publishedAt: doc.publishedAt.toISOString(),
      isActive: doc.isActive,
      expectedDuration: doc.expectedDuration,
      description: doc.description
    }));

    console.log('✅ Returning filtered classes:', filteredClasses.length);

    return NextResponse.json({
      success: true,
      liveClasses: filteredClasses,
      count: filteredClasses.length
    });

  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live classes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { classId, teacherId } = await request.json();

    if (!classId || !teacherId) {
      return NextResponse.json(
        { error: 'Class ID and Teacher ID required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Find the live class
    const liveClass = await db.collection(LIVE_CLASSES_COLLECTION).findOne({
      id: classId,
      isActive: true
    });
    
    if (!liveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Check if teacher owns this class
    if (liveClass.teacherId !== teacherId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Mark as inactive instead of deleting immediately
    await db.collection(LIVE_CLASSES_COLLECTION).updateOne(
      { id: classId },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Live class ended successfully'
    });

  } catch (error) {
    console.error('Error ending live class:', error);
    return NextResponse.json(
      { error: 'Failed to end live class' },
      { status: 500 }
    );
  }
}

// Helper functions
function isValidMeetingLink(link: string): boolean {
  try {
    const url = new URL(link);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function detectPlatform(link: string): string | null {
  const url = link.toLowerCase();
  
  if (url.includes('daily.co')) {
    return 'daily';
  } else if (url.includes('zoom.us') || url.includes('zoom.com')) {
    return 'zoom';
  } else if (url.includes('meet.google.com')) {
    return 'google-meet';
  } else if (url.includes('teams.microsoft.com') || url.includes('teams.live.com')) {
    return 'teams';
  } else if (url.includes('jitsi') || url.includes('meet.jit.si')) {
    return 'jitsi';
  } else if (url.includes('webex.com')) {
    return 'webex';
  } else if (url.includes('gotomeeting.com')) {
    return 'gotomeeting';
  }
  
  return null;
}
