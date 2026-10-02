import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { auth } from '@/auth';
import { emailFrom } from '@/lib/email';

// SMTP config with env support
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.EMAIL_USER ?? '';
const smtpPass = process.env.EMAIL_PASSWORD ?? '';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

interface BulkEmailRequest {
  emails: string[];
  subject: string;
  content: string;
  teacherId: string;
}

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
}

// Create beautiful HTML template for marketing emails
function createMarketingEmailHTML(content: string, teacherName?: string): string {
  // Convert line breaks to paragraphs for better formatting
  const formattedContent = content
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message from YuvaBot Lab</title>
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
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .content p {
          margin: 0 0 20px 0;
          font-size: 16px;
          line-height: 1.7;
        }
        .content p:last-child {
          margin-bottom: 0;
        }
        .signature {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-style: italic;
          color: #6b7280;
        }
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          margin: 0;
          font-size: 14px;
        }
        .footer .logo {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .header, .content, .footer {
            padding: 20px;
          }
          .header h1 {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📧 Message from Your Teacher</h1>
          <p>YuvaBot Lab Academy</p>
        </div>
        <div class="content">
          ${formattedContent}
          ${teacherName ? `
            <div class="signature">
              <p>Best regards,<br>
              <strong>${teacherName}</strong><br>
              YuvaBot Lab Faculty</p>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p class="logo">YuvaBot Lab</p>
          <p>Your Gateway to Future Technologies</p>
          <p>📧 info@YuvaBot.com | 🌐 www.yuvabot.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    // Without this check anyone could use the SMTP credentials as an open relay.
    const session = await auth();
    if (!session?.user || (session.user.role !== 'COACH' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'Email sending is not configured on this deployment' },
        { status: 503 }
      );
    }

    const body: BulkEmailRequest = await request.json();
    const { emails, subject, content, teacherId } = body;

    // Validate input
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'No valid emails provided' },
        { status: 400 }
      );
    }

    if (!subject.trim() || !content.trim()) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    console.log(`📧 Starting bulk email send to ${emails.length} recipients`);
    console.log(`📋 Subject: ${subject}`);

    const results: EmailResult[] = [];
    const emailHTML = createMarketingEmailHTML(content);

    // Send emails one by one to track individual results
    for (const email of emails) {
      try {
        console.log(`📤 Sending to: ${email}`);
        
        const mailOptions = {
          from: emailFrom,
          to: email,
          subject: subject,
          html: emailHTML,
        };

        const info = await transporter.sendMail(mailOptions);
        
        results.push({
          email,
          success: true
        });

        console.log(`✅ Successfully sent to: ${email} (Message ID: ${info.messageId})`);
        
        // Small delay to avoid overwhelming the SMTP server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to send to ${email}:`, error);
        
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`📊 Bulk email completed: ${successCount} successful, ${failureCount} failed`);

    return NextResponse.json({
      message: `Bulk email completed: ${successCount} sent, ${failureCount} failed`,
      results,
      summary: {
        total: emails.length,
        successful: successCount,
        failed: failureCount
      }
    });

  } catch (error) {
    console.error('❌ Bulk email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
