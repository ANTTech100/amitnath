# Email Setup Guide

## Quick Setup for Resend Email Integration

### 1. Get Your Free Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Go to the API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
RESEND_API_KEY=re_your_api_key_here
```

Replace `re_your_api_key_here` with your actual API key from Resend.

### 3. Features

✅ **Free Tier**: 100 emails per day  
✅ **No Domain Required**: Uses Resend's sandbox domain  
✅ **Beautiful UI**: Modern, responsive design  
✅ **Real-time Feedback**: Toast notifications  
✅ **Form Validation**: Required field validation  
✅ **Loading States**: Visual feedback during sending  

### 4. Usage

1. Navigate to `/email` in your app
2. Fill in the recipient email, subject, and message
3. Optionally add a "From Name"
4. Click "Send Email"

### 5. Email Template

The emails are sent with a beautiful HTML template including:
- Gradient header
- Clean typography
- Professional styling
- Responsive design

### 6. API Endpoint

The email functionality is available at `/api/email` and accepts:
- `to`: Recipient email address
- `subject`: Email subject
- `message`: Email content
- `fromName`: Optional sender name

### 7. Testing

You can test by sending emails to your own email address or any valid email address.

### 8. Production Notes

For production use:
- Consider adding rate limiting
- Add email validation
- Set up proper error handling
- Add email templates for different use cases 