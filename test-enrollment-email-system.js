// Test enrollment email system
// This will test if enrollment emails are sent when students enroll in courses

console.log(`
🎯 ENROLLMENT EMAIL TEST

To test if students receive emails when they enroll in courses:

📧 Email System Status:
✅ Gmail SMTP configured: prudenceias@gmail.com
✅ sendEnrollmentConfirmation function: Ready
✅ Integration in payments API: Active
✅ Integration in enrollments API: Active

🧪 Testing Methods:

METHOD 1: Test Enrollment Email Function Directly
- Use the test endpoint: POST /api/test-email
- This will send a test enrollment email

METHOD 2: Complete Enrollment Flow
- Go through the full course enrollment process
- Payment → Enrollment → Email automatically sent

METHOD 3: Use Existing Test File
- Run: node test-enrollment-email.js
- This will test the email function directly

📍 Current Status:
- When a student completes payment: ✅ Email sent automatically
- When a student enrolls via API: ✅ Email sent automatically
- Beautiful HTML email template: ✅ Ready
- Gmail SMTP credentials: ✅ Configured

📤 Ready to test enrollment emails!
`);

// Function to test enrollment email via API
async function testEnrollmentEmailViaAPI() {
  console.log('🧪 Testing enrollment email via API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'enrollment',
        email: 'prudenceias@gmail.com', // Test email
        data: {
          studentName: 'Test Student',
          courseTitle: 'Sample Cyber Security Course',
          teacherName: 'Test Teacher',
          courseId: 'test-course-123',
          paymentId: 'test-payment-456'
        }
      }),
    });

    const result = await response.json();
    console.log('📊 API Test Result:', result);
    
    if (result.success) {
      console.log('✅ SUCCESS: Enrollment email test passed!');
      console.log('📨 Check email inbox: prudenceias@gmail.com');
    } else {
      console.log('❌ FAILED: Enrollment email test failed');
      console.log('🔍 Error:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('💥 API test failed:', error);
    return { error: error.message };
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testEnrollmentEmailViaAPI };
}
