# Deployment Guide

This guide covers how to deploy the Consultation Booking Module to various platforms.

## 🐳 Docker Deployment

### Local Docker
```bash
# Build the image
docker build -t consultation-booking .

# Run the container
docker run -p 3000:3000 --env-file .env consultation-booking
```

### Docker Compose
```bash
# Create .env file with your configuration
cp env.example .env
# Edit .env with your credentials

# Start the application
docker-compose up -d
```

## ☁️ Cloud Platform Deployment

### 1. Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (update with your Railway domain)
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `ADMIN_EMAIL`
   - `ADMIN_NAME`
3. Railway will automatically deploy using the `railway.toml` configuration

### 2. Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard (same as Railway)
4. Render will use the `render.yaml` configuration

### 3. Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
heroku config:set GOOGLE_REDIRECT_URI=https://your-app-name.herokuapp.com/auth/google/callback
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASS=your_app_password
heroku config:set ADMIN_EMAIL=admin@yourdomain.com
heroku config:set ADMIN_NAME="Your Name"

# Deploy
git push heroku main
```

### 4. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 5. DigitalOcean App Platform

1. Connect your GitHub repository
2. Choose Node.js environment
3. Set environment variables
4. Deploy

## 🔧 Environment Variables

All platforms require these environment variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_NAME=Your Name
NODE_ENV=production
PORT=3000
```

## 🌐 Domain Configuration

### Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your production domain to Authorized redirect URIs:
   - `https://yourdomain.com/auth/google/callback`

### Update Environment Variables

Update `GOOGLE_REDIRECT_URI` to match your production domain:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

## 📊 Health Checks

All platforms can use the built-in health check endpoint:
- **URL:** `/api/health`
- **Method:** GET
- **Response:** `{"status": "OK", "timestamp": "...", "service": "Consultation Booking API"}`

## 🗄️ Database

The application uses SQLite by default, which works well for small to medium deployments. For high-traffic applications, consider:

1. **PostgreSQL** (recommended for production)
2. **MySQL**
3. **MongoDB**

To switch databases, modify `src/database.js` and update dependencies.

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in `EMAIL_PASS` environment variable

### Alternative Email Providers
- **SendGrid** - Update `src/services/emailService.js`
- **Mailgun** - Update transporter configuration
- **AWS SES** - Modify email service

## 🔒 Security Considerations

### Production Checklist
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong environment variables
- [ ] Enable CORS for your domain only
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Database backups
- [ ] Rate limiting (optional)

### CORS Configuration
Update `server.js` for production:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## 📈 Monitoring

### Application Monitoring
- **Health Check:** `/api/health`
- **Logs:** Check platform-specific logging
- **Database:** Monitor SQLite file size
- **Email:** Track email delivery rates

### Analytics
Add Google Analytics or similar to track:
- Booking conversions
- Widget usage
- User interactions

## 🚀 Performance Optimization

### Production Optimizations
1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Database indexing**
4. **Caching headers**
5. **Process management (PM2)**

### Scaling
For high traffic:
1. **Load balancer**
2. **Multiple instances**
3. **Database clustering**
4. **Redis for sessions**

## 🛠️ Troubleshooting

### Common Deployment Issues

**1. OAuth Redirect URI Mismatch**
- Update Google Cloud Console with production URL
- Ensure HTTPS is used in production

**2. Email Not Sending**
- Verify Gmail App Password
- Check environment variables
- Test SMTP connection

**3. Database Permissions**
- Ensure write permissions for SQLite file
- Check database path in environment

**4. Build Failures**
- Verify Node.js version compatibility
- Check all dependencies are installed
- Review build logs

### Debug Mode
Set environment variable for detailed logging:
```env
NODE_ENV=development
```

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test locally first
4. Review platform-specific documentation

## 🔄 Updates

To update the deployed application:
1. Push changes to your GitHub repository
2. Platform will auto-deploy (if configured)
3. Or manually trigger deployment

## 📋 Post-Deployment Checklist

- [ ] Test booking form
- [ ] Verify Google OAuth flow
- [ ] Test email notifications
- [ ] Check admin dashboard
- [ ] Test embed widgets
- [ ] Verify health check endpoint
- [ ] Test on mobile devices
- [ ] Check all environment variables
- [ ] Monitor for errors

Your consultation booking module is now ready for production! 🎉