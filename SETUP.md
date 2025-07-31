# Consultation Booking Module - Setup Instructions

This module provides a complete consultation booking system with Google Meet integration, email notifications, and embeddable widgets.

## Features

- ✅ Google OAuth 2.0 authentication
- ✅ Google Calendar integration with automatic Meet link generation
- ✅ Email confirmations and reminders (10 minutes before meetings)
- ✅ SQLite database for booking storage
- ✅ Embeddable widget (iframe and JavaScript)
- ✅ Multi-language support (English/French)
- ✅ Responsive design
- ✅ Free to use (no paid APIs required)

## Prerequisites

- Node.js (v14 or higher)
- Gmail account for sending emails
- Google Cloud Console account (free)

## Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd consultation-booking-module
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
```

Edit the `.env` file with your configuration (see Google Setup section below).

3. **Start the server:**
```bash
npm start
# or for development:
npm run dev
```

The application will be available at:
- Main booking page: `http://localhost:3000`
- Embeddable widget: `http://localhost:3000/embed`
- API endpoints: `http://localhost:3000/api/*`

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Consultation Booking")
4. Click "Create"

### Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for and enable these APIs:
   - **Google Calendar API**
   - **Google Meet API** (automatically enabled with Calendar API)

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Consultation Booking"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: `../auth/calendar` and `../auth/calendar.events`
   - Add test users (your email and any other emails you want to test with)

4. Create OAuth client ID:
   - Application type: "Web application"
   - Name: "Consultation Booking Web Client"
   - Authorized redirect URIs: 
     - `http://localhost:3000/auth/google/callback`
     - `https://yourdomain.com/auth/google/callback` (for production)

5. Copy the **Client ID** and **Client Secret**

### Step 4: Configure Gmail for Email Sending

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

### Step 5: Update Environment Variables

Edit your `.env` file:

```env
# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_client_id_from_step_3
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_3
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password_from_step_4

# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_PATH=./database.sqlite

# Admin Configuration
ADMIN_EMAIL=your_email@gmail.com
ADMIN_NAME=Your Name
```

## First Time Setup

1. **Start the server:**
```bash
npm start
```

2. **Authenticate with Google:**
   - Visit `http://localhost:3000`
   - You'll see an authentication notice
   - Click "Click here to authenticate"
   - Sign in with your Google account
   - Grant permissions for Calendar access

3. **Test the booking system:**
   - Fill out the booking form
   - Check that the Google Meet link is generated
   - Verify email confirmation is sent
   - Check your Google Calendar for the event

## Embedding the Widget

### Method 1: Iframe Embed

```html
<iframe 
    src="http://localhost:3000/embed" 
    width="500" 
    height="600" 
    frameborder="0"
    style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>
```

### Method 2: JavaScript Embed (Recommended)

```html
<!-- Basic embed -->
<div id="consultation-booking-widget"></div>
<script src="http://localhost:3000/embed.js"></script>

<!-- Custom configuration -->
<script>
window.ConsultationBookingConfig = {
    containerId: 'my-booking-widget',
    serverUrl: 'http://localhost:3000',
    language: 'fr', // 'en' or 'fr'
    width: '100%',
    height: '650px'
};
</script>
<div id="my-booking-widget"></div>
<script src="http://localhost:3000/embed.js"></script>
```

### Method 3: Listen for Booking Events

```html
<script>
window.addEventListener('consultationBooked', function(event) {
    console.log('Booking successful:', event.detail);
    // Handle successful booking (analytics, redirects, etc.)
});
</script>
```

## API Endpoints

### Booking API
- `POST /api/book` - Create new booking
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/booking/:id` - Get specific booking
- `GET /api/available-slots?date=YYYY-MM-DD` - Get available time slots
- `GET /api/health` - Health check

### Authentication API
- `GET /auth/google` - Initiate OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/status` - Check authentication status

## Customization

### Language Support
The system supports English and French. To add more languages:

1. Edit `public/index.html` and `public/embed.html`
2. Add translations to the `translations` object
3. Add language option to the select dropdown

### Styling
- Main page: Edit styles in `public/index.html`
- Embed widget: Edit styles in `public/embed.html`
- Custom CSS can be added via the embed configuration

### Time Slots
Edit available time slots in:
- Frontend: `public/index.html` and `public/embed.html` (option elements)
- Backend: `src/routes/booking.js` (available-slots endpoint)

### Email Templates
Customize email templates in `src/services/emailService.js`:
- `getBookingConfirmationTemplate()` - Confirmation email
- `getReminderTemplate()` - Reminder email

## Production Deployment

### 1. Update Environment Variables
```env
NODE_ENV=production
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### 2. Update OAuth Redirect URIs
In Google Cloud Console, add your production domain to authorized redirect URIs.

### 3. SSL Certificate
Ensure your domain has SSL certificate (required for Google OAuth).

### 4. Process Manager
Use PM2 or similar for production:
```bash
npm install -g pm2
pm2 start server.js --name consultation-booking
pm2 startup
pm2 save
```

### 5. Reverse Proxy
Configure nginx or Apache to proxy requests to your Node.js app.

## Troubleshooting

### Common Issues

1. **"Google Calendar not authenticated"**
   - Visit `/auth/google` to authenticate
   - Check OAuth credentials in `.env`
   - Ensure Calendar API is enabled

2. **Email not sending**
   - Verify Gmail app password
   - Check 2FA is enabled on Gmail account
   - Ensure EMAIL_USER and EMAIL_PASS are correct

3. **"Booking failed"**
   - Check server logs for detailed errors
   - Verify database permissions
   - Ensure all required fields are provided

4. **OAuth errors**
   - Verify redirect URI matches exactly
   - Check client ID and secret
   - Ensure OAuth consent screen is configured

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

### Logs
Check console output for detailed error information and booking confirmations.

## Security Notes

- Never commit `.env` file to version control
- Use strong, unique passwords for email accounts
- Regularly rotate OAuth credentials
- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify Google Cloud Console configuration
4. Test with different browsers/devices

## License

MIT License - Free to use and modify for personal and commercial projects.