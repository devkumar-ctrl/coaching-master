# Email Setup Guide for Prudence IAS

This guide will help you set up email functionality for sending enrollment confirmations and welcome emails.

## Email Configuration Options

### Option 1: Gmail (Recommended)
1. Create a Gmail account or use an existing one
2. Enable 2-Factor Authentication on your Google account
3. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
4. Update your `.env.local` file:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### Option 2: Custom SMTP
For custom email services (like your hosting provider):
```env
SMTP_HOST=mail.your-domain.com
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASSWORD=your-password
```

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Email Configuration (Choose one method)
# Method 1: Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Method 2: Custom SMTP
# SMTP_HOST=your-smtp-host.com
# SMTP_PORT=587
# SMTP_USER=your-smtp-username
# SMTP_PASSWORD=your-smtp-password

# App URL for email links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Email Templates

The system includes two main email templates:

### 1. Enrollment Confirmation Email
- Sent automatically when a student enrolls in a course
- Contains course details, instructor information, and next steps
- Includes a direct link to the course

### 2. Welcome Email
- Can be sent when users register (optional)
- Introduces the platform and encourages course exploration

## Testing Emails

To test the email functionality:

1. **Local Development:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

2. **Enroll in a course** to trigger the enrollment confirmation email

3. **Check your email configuration** by looking at the console logs

## Email Features

### Enrollment Confirmation Email includes:
- ✅ Personalized greeting
- ✅ Course details (name, instructor, enrollment date)
- ✅ Payment confirmation (if applicable)
- ✅ Direct link to start learning
- ✅ Next steps guide
- ✅ Support contact information
- ✅ Professional HTML design
- ✅ Mobile-responsive layout

### Security Features:
- ✅ Encrypted email transmission
- ✅ No sensitive data in email content
- ✅ Secure SMTP authentication
- ✅ Error handling and logging

## Troubleshooting

### Common Issues:

1. **"Authentication failed" error:**
   - Make sure you're using an App Password (not your regular password)
   - Check that 2FA is enabled on your Google account

2. **"Connection refused" error:**
   - Verify SMTP host and port settings
   - Check if your hosting provider blocks SMTP

3. **Emails not being sent:**
   - Check console logs for error messages
   - Verify environment variables are loaded correctly
   - Test with a simple email service first

### Testing Email Configuration:

You can test your email setup by running this in your application:

```javascript
// Test email function (add to a test API route)
import { sendEnrollmentConfirmation } from '@/lib/email';

const testEmail = await sendEnrollmentConfirmation({
  studentName: 'Test Student',
  studentEmail: 'test@example.com',
  courseTitle: 'Test Course',
  teacherName: 'Test Teacher',
  enrollmentDate: new Date(),
  courseId: 'test-course-id'
});

console.log('Email test result:', testEmail);
```

## Production Considerations

### For Production Deployment:

1. **Use a dedicated email service:**
   - Consider services like SendGrid, Mailgun, or AWS SES
   - These provide better deliverability and analytics

2. **Set up proper DNS records:**
   - SPF, DKIM, and DMARC records for better email delivery
   - Verify your domain with your email service

3. **Monitor email delivery:**
   - Set up logging and monitoring for email failures
   - Track bounce rates and spam complaints

4. **Update environment variables:**
   ```env
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   EMAIL_USER=noreply@your-domain.com
   ```

## Email Service Alternatives

### SendGrid Setup:
```env
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Mailgun Setup:
```env
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
```

### AWS SES Setup:
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

## Support

If you need help with email setup:
- Check the console logs for detailed error messages
- Test with a simple Gmail setup first
- Contact your hosting provider for SMTP details
- Review the email library documentation

---

**Note:** Remember to never commit your actual email credentials to version control. Always use environment variables and add `.env.local` to your `.gitignore` file.
