# Vercel Deployment Setup Guide

## Environment Variables Required for Vercel

To fix the image upload issue, you need to add the following environment variables in your Vercel dashboard:

### 1. Cloudinary Configuration
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. NextAuth Configuration
```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Database Configuration
```bash
MONGODB_URI=your_mongodb_connection_string
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click on **Environment Variables**
5. Add each variable with the following settings:
   - **Name**: Variable name (e.g., `CLOUDINARY_CLOUD_NAME`)
   - **Value**: Variable value
   - **Environment**: Select all environments (Production, Preview, Development)

## Testing the Configuration

After adding the environment variables, you can test the setup by visiting:
```
https://your-domain.vercel.app/api/test-cloudinary
```

This endpoint will check if all Cloudinary environment variables are properly configured.

## Common Issues and Solutions

### 1. 500 Error on Image Upload
- **Cause**: Missing Cloudinary environment variables
- **Solution**: Add all three Cloudinary variables in Vercel settings

### 2. Authentication Issues
- **Cause**: Missing or incorrect NEXTAUTH_URL
- **Solution**: Set NEXTAUTH_URL to your exact Vercel domain

### 3. Database Connection Issues
- **Cause**: Missing or incorrect MONGODB_URI
- **Solution**: Verify your MongoDB connection string

## Deployment Steps

1. **Push your code** to GitHub
2. **Add environment variables** in Vercel dashboard
3. **Redeploy** your application (this happens automatically)
4. **Test the image upload** functionality

## Troubleshooting

If you're still experiencing issues:

1. Check the Vercel function logs for detailed error messages
2. Visit `/api/test-cloudinary` to verify Cloudinary configuration
3. Ensure all environment variables are set for all environments
4. Redeploy after adding environment variables

## Environment Variable Values

To get your Cloudinary values:
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy the **Cloud name**, **API Key**, and **API Secret**
3. Add them to your Vercel environment variables

## Security Notes

- Never commit environment variables to your repository
- Keep your API secrets secure
- Use different values for development and production if needed
