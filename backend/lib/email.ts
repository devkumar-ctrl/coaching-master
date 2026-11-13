import nodemailer from 'nodemailer';

// SMTP configuration - all values must come from env vars (see .env.example):
//   SMTP_HOST, SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM
// Never hardcode credentials here: this module is bundled into the deployment.
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.EMAIL_USER ?? '';
const smtpPass = process.env.EMAIL_PASSWORD ?? '';
export const emailFrom = process.env.EMAIL_FROM || `"YuvaBot Lab" <${smtpUser}>`;

export function isSmtpConfigured(): boolean {
  return Boolean(smtpUser && smtpPass);
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

interface EnrollmentEmailData {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  teacherName: string;
  enrollmentDate: Date;
  courseId: string;
  paymentId?: string;
}

export async function sendEnrollmentConfirmation(data: EnrollmentEmailData) {
  const {
    studentName,
    studentEmail,
    courseTitle,
    teacherName,
    enrollmentDate,
    courseId,
    paymentId
  } = data;

  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Course Enrollment Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .course-details {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 5px;
        }
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Welcome to YuvaBot Lab!</h1>
          <p>Your technology journey begins now</p>
        </div>
        <div class="content">
          <p>Dear ${studentName},</p>
          <p>Congratulations! You have successfully enrolled in ${courseTitle}.</p>
          <div class="course-details">
            <h3>📚 Course Details</h3>
            <p><strong>Course:</strong> ${courseTitle}</p>
            <p><strong>Instructor:</strong> ${teacherName}</p>
            <p><strong>Enrollment Date:</strong> ${enrollmentDate.toLocaleDateString()}</p>
            ${paymentId ? `<p><strong>Payment ID:</strong> ${paymentId}</p>` : ''}
          </div>
          <p>Best regards,<br><strong>The YuvaBot Lab Team</strong></p>
        </div>
        <div class="footer">
          <p><strong>YuvaBot Lab</strong></p>
          <p>Your Gateway to Future Technologies</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: emailFrom,
    to: studentEmail,
    subject: `🎉 Welcome to ${courseTitle} - Course Enrollment Confirmed`,
    html: emailHTML,
  };

  try {
    console.log('🚀 Sending enrollment confirmation via Gmail...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Enrollment email sent successfully to:', studentEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending enrollment email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

interface LiveClassEmailData {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  teacherName: string;
  classTitle: string;
  meetingLink: string;
  startTime: Date;
}

export async function sendLiveClassNotification(data: LiveClassEmailData) {
  const {
    studentName,
    studentEmail,
    courseTitle,
    teacherName,
    classTitle,
    meetingLink,
    startTime
  } = data;

  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Live Class Starting Now!</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .class-details {
          background-color: #fff5f5;
          border-left: 4px solid #ff6b6b;
          padding: 20px;
          margin: 25px 0;
          border-radius: 5px;
        }
        .join-button {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          padding: 20px 40px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 18px;
          text-align: center;
          margin: 25px 0;
        }
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔴 Live Class Alert!</h1>
          <div style="background-color: #ff4757; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin-top: 10px;">● LIVE NOW</div>
        </div>
        <div class="content">
          <p><strong>Dear ${studentName},</strong></p>
          <p>Your teacher has started a live class!</p>
          <div class="class-details">
            <h3>📚 Live Class Details</h3>
            <p><strong>Class:</strong> ${classTitle}</p>
            <p><strong>Course:</strong> ${courseTitle}</p>
            <p><strong>Instructor:</strong> ${teacherName}</p>
            <p><strong>Started:</strong> ${startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
          <div style="text-align: center;">
            <a href="${meetingLink}" class="join-button" target="_blank">🎥 Join Live Class Now</a>
          </div>
          <p>Don't miss this opportunity to learn directly from your instructor!</p>
          <p>Best regards,<br><strong>The YuvaBot Lab Team</strong></p>
        </div>
        <div class="footer">
          <p><strong>YuvaBot Lab</strong></p>
          <p>Your Gateway to Future Technologies</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: emailFrom,
    to: studentEmail,
    subject: `🔴 LIVE NOW: ${classTitle} | ${courseTitle}`,
    html: emailHTML,
  };

  try {
    console.log('🚀 Sending live class notification via Gmail...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Live class notification sent successfully to:', studentEmail);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending live class notification:', error);
    
    // Log email content for debugging
    console.log('📧 EMAIL CONTENT THAT FAILED TO SEND:');
    console.log('To:', studentEmail);
    console.log('Subject:', mailOptions.subject);
    console.log('From:', mailOptions.from);
    console.log('Student:', studentName);
    console.log('Course:', courseTitle);
    console.log('Teacher:', teacherName);
    console.log('Meeting Link:', meetingLink);
    
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function sendWelcomeEmail(name: string, email: string) {
  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to YuvaBot Lab</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Welcome to YuvaBot Lab!</h1>
          <p>Your technology training journey starts here</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Welcome to YuvaBot Lab! We're thrilled to have you join our community of dedicated tech learners.</p>
          <p>Best regards,<br><strong>The YuvaBot Lab Team</strong></p>
        </div>
        <div class="footer">
          <p><strong>YuvaBot Lab</strong></p>
          <p>Your Gateway to Future Technologies</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: '🎉 Welcome to YuvaBot Lab - Start Your Tech Journey!',
    html: emailHTML,
  };

  try {
    console.log('🚀 Sending welcome email via Gmail...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function sendOtpEmail(name: string, email: string, otp: string) {
  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login OTP - YuvaBot Lab</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background-color: #f0f4ff;
          border: 2px dashed #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 10px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 10px;
          color: #333;
        }
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 30px 20px;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔐 Login Verification</h1>
          <p>Your One-Time Password (OTP)</p>
        </div>
        <div class="content">
          <p>Dear ${name || 'User'},</p>
          <p>Use the OTP below to complete your login to <strong>YuvaBot Lab</strong>. This code is valid for <strong>10 minutes</strong>.</p>
          <div class="otp-box">${otp}</div>
          <p>If you did not request this code, please ignore this email and do not share the OTP with anyone.</p>
          <p>Best regards,<br><strong>The YuvaBot Lab Team</strong></p>
        </div>
        <div class="footer">
          <p><strong>YuvaBot Lab</strong></p>
          <p>Learn · Build · Innovate</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: '🔐 Your YuvaBot Lab Login OTP',
    html: emailHTML,
  };

  try {
    console.log('🚀 Sending login OTP email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Test SMTP connection function
export async function testSMTPConnection() {
  try {
    console.log('🔍 Testing SMTP connection...');
    const verified = await transporter.verify();
    console.log('✅ SMTP connection successful:', verified);
    return { success: true };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

interface LessonReminderData {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  lessonTitle: string;
  teacherName: string;
  startTime: Date;
  joinUrl: string;
  kind: 'scheduled' | '24h' | '1h';
}

// Notifies a learner about an upcoming live lesson (invite or reminder).
export async function sendLessonReminder(data: LessonReminderData) {
  const { studentName, studentEmail, courseTitle, lessonTitle, teacherName, startTime, joinUrl, kind } = data;

  const heading =
    kind === 'scheduled' ? 'New Live Class Scheduled' : kind === '24h' ? 'Live Class Tomorrow' : 'Live Class Starting Soon';

  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${heading}</title>
    </head>
    <body style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#1f1f1f;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5;">
      <div style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9e9e9;">
        <div style="background:#e60035;color:#ffffff;padding:28px 20px;text-align:center;">
          <h1 style="margin:0;font-size:22px;">${heading}</h1>
        </div>
        <div style="padding:32px 28px;">
          <p>Hi ${studentName},</p>
          <p>Your live class for <strong>${courseTitle}</strong> is on the way.</p>
          <div style="background:#fbe2e8;border-left:4px solid #e60035;padding:18px 20px;margin:22px 0;border-radius:8px;">
            <p style="margin:0 0 8px;"><strong>${lessonTitle}</strong></p>
            <p style="margin:0 0 4px;">Instructor: ${teacherName}</p>
            <p style="margin:0;">Starts: ${startTime.toUTCString()} (UTC)</p>
          </div>
          <div style="text-align:center;margin:28px 0;">
            <a href="${joinUrl}" style="display:inline-block;background:#e60035;color:#ffffff;padding:14px 32px;border-radius:9999px;text-decoration:none;font-weight:600;">Join Class</a>
          </div>
          <p style="color:#626262;font-size:13px;">Times are shown in UTC. Open your dashboard to see it in your local timezone and add it to your calendar.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!isSmtpConfigured()) {
    console.warn('SMTP not configured — skipping lesson reminder email to', studentEmail);
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to: studentEmail,
      subject: `${heading}: ${lessonTitle}`,
      html: emailHTML,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending lesson reminder:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}