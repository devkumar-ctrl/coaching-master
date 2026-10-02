import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { sendEnrollmentConfirmation } from '@/lib/email'

// Lazily constructed: Razorpay's constructor throws when the keys are absent,
// which would otherwise break `next build` (and any cold start) on deployments
// that have not configured payments yet.
let razorpayInstance: Razorpay | null = null

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
      throw new Error('Razorpay is not configured: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET')
    }
    razorpayInstance = new Razorpay({ key_id, key_secret })
  }
  return razorpayInstance
}

// Generate a receipt ID that's under 40 characters (Razorpay limit)
function generateReceiptId(courseId: string): string {
  const timestamp = Date.now().toString(36) // Base36 for shorter string
  const courseHash = courseId.slice(-6) // Last 6 chars of course ID
  return `c_${courseHash}_${timestamp}` // Format: c_abc123_timestamp
}

// Create payment order
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can make payments' }, { status: 401 })
    }

    const { amount, currency = 'INR', courseId, courseName } = await request.json()

    if (!amount || !courseId) {
      return NextResponse.json(
        { error: 'Amount and course ID are required' },
        { status: 400 }
      )
    }

    const db = await getDatabase();

    // Verify course exists and is published
    const course = await db.collection("courses").findOne({
      _id: new ObjectId(courseId),
      status: 'published'
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or not available' },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await db.collection("enrollments").findOne({
      studentId: session.user.id,
      courseId: courseId
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Verify amount matches course price
    if (amount !== course.price) {
      return NextResponse.json(
        { error: 'Payment amount does not match course price' },
        { status: 400 }
      )
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: generateReceiptId(courseId),
      notes: {
        courseId,
        courseName: course.title,
        coursePrice: course.price,
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name,
        teacherId: course.teacherId,
        teacherName: course.teacherName || 'Unknown'
      },
    }

    const order = await getRazorpay().orders.create(options as any)

    // Store payment intent in database
    await db.collection("payment_intents").insertOne({
      orderId: order.id,
      courseId: courseId,
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      amount: amount,
      currency: currency,
      status: 'created',
      courseTitle: course.title,
      teacherId: course.teacherId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      course: {
        id: course._id.toString(),
        title: course.title,
        image: course.image,
        teacherName: course.teacherName
      }
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}

// Verify payment and complete enrollment
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId
    } = await request.json()

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const db = await getDatabase();

    // Get payment intent
    const paymentIntent = await db.collection("payment_intents").findOne({
      orderId: razorpay_order_id,
      studentId: session.user.id
    })

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      )
    }

    // Get course details
    const course = await db.collection("courses").findOne({
      _id: new ObjectId(paymentIntent.courseId)
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if already enrolled (double check)
    const existingEnrollment = await db.collection("enrollments").findOne({
      studentId: session.user.id,
      courseId: paymentIntent.courseId
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Create enrollment record
    const enrollment = {
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      courseId: paymentIntent.courseId,
      courseTitle: course.title,
      teacherId: course.teacherId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amountPaid: paymentIntent.amount,
      enrolledAt: new Date(),
      status: 'active',
      progress: 0,
      completedClasses: 0
    }

    const enrollmentResult = await db.collection("enrollments").insertOne(enrollment)

    // Update course enrollment count
    await db.collection("courses").updateOne(
      { _id: new ObjectId(paymentIntent.courseId) },
      { 
        $inc: { enrolledCount: 1 },
        $addToSet: { 
          enrolledStudents: {
            studentId: session.user.id,
            studentName: session.user.name || 'Unknown',
            enrolledAt: new Date(),
            paymentId: razorpay_payment_id
          }
        }
      }
    )

    // Store payment record
    await db.collection("payments").insertOne({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      courseId: paymentIntent.courseId,
      courseTitle: course.title,
      teacherId: course.teacherId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'completed',
      enrollmentId: enrollmentResult.insertedId.toString(),
      completedAt: new Date(),
      signature: razorpay_signature
    })

    // Update payment intent status
    await db.collection("payment_intents").updateOne(
      { orderId: razorpay_order_id },
      { 
        $set: { 
          status: 'completed',
          paymentId: razorpay_payment_id,
          completedAt: new Date()
        }
      }
    )

    // Send enrollment confirmation email
    try {
      if (session.user.email) {
        console.log('Attempting to send enrollment confirmation email...');
        const emailResult = await sendEnrollmentConfirmation({
          studentName: session.user.name || 'Student',
          studentEmail: session.user.email,
          courseTitle: course.title,
          teacherName: course.teacherName || 'Instructor',
          enrollmentDate: new Date(),
          courseId: paymentIntent.courseId,
          paymentId: razorpay_payment_id
        });
        
        if (emailResult.success) {
          console.log('✅ Enrollment confirmation email sent successfully!');
        } else {
          console.log('❌ Failed to send enrollment email:', emailResult.error);
        }
      }
    } catch (emailError) {
      // Log email error but don't fail the payment process
      console.error('❌ Email sending error (payment still successful):', emailError);
    }
    
    return NextResponse.json({
      message: 'Payment verified and enrollment completed successfully!',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      enrollmentId: enrollmentResult.insertedId.toString(),
      course: {
        id: course._id.toString(),
        title: course.title
      }
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
