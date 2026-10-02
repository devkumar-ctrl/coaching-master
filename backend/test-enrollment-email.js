const { sendEnrollmentConfirmation } = require('./lib/email');

async function testEnrollmentEmail() {
  console.log('🧪 Testing enrollment email functionality...');
  
  try {
    const result = await sendEnrollmentConfirmation({
      studentName: 'Test Student',
      studentEmail: 'prudenceias@gmail.com', // Sending to same Gmail account
      courseTitle: 'Test Course - Cyber Security',
      teacherName: 'Test Instructor',
      enrollmentDate: new Date(),
      courseId: 'test-course-123',
      paymentId: 'test-payment-456'
    });
    
    console.log('📧 Email test result:', result);
    
    if (result.success) {
      console.log('✅ SUCCESS: Enrollment email sent successfully!');
      console.log('📨 Message ID:', result.messageId);
      console.log('💡 Check the email inbox for: prudenceias@gmail.com');
    } else {
      console.log('❌ FAILED: Email sending failed');
      console.log('🔍 Error:', result.error);
    }
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

testEnrollmentEmail();
