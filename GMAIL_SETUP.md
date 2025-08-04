# Gmail SMTP Setup Guide

## Send Emails to Anyone Using Gmail

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "App passwords" (under 2-Step Verification)
3. Select "Mail" as the app
4. Click "Generate"
5. Copy the 16-character password

### Step 3: Set Environment Variables

Create a `.env.local` file in your project root and add:

```env
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

Replace:
- `your.email@gmail.com` with your Gmail address
- `your_16_character_app_password` with the app password from Step 2

### Step 4: Test the Email System

1. Start your development server: `npm run dev`
2. Go to `/email` in your app
3. Fill in the form with any email address
4. Click "Send Email"

### Features

✅ **Send to Anyone**: Can send emails to any email address worldwide  
✅ **Beautiful Templates**: Professional HTML email templates  
✅ **No Domain Required**: Uses your Gmail account  
✅ **Reliable**: Gmail's trusted infrastructure  
✅ **Free**: No additional costs beyond your Gmail account  

### Security Notes

- Never commit your `.env.local` file to version control
- The app password is different from your regular Gmail password
- You can revoke app passwords anytime from Google Account settings

### Troubleshooting

If emails don't send:
1. Check that 2-Factor Authentication is enabled
2. Verify the app password is correct
3. Make sure environment variables are set correctly
4. Check the console for error messages

### Production Deployment

For production:
1. Set environment variables on your hosting platform
2. Consider using a dedicated email service for high volume
3. Add rate limiting to prevent abuse 