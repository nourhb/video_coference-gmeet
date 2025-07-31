# Free Consultation Booking Module

A complete consultation booking system with Google Meet integration, built with Node.js. Features automatic Google Meet link generation, email confirmations, reminders, and embeddable widgets.

![Consultation Booking Widget](https://via.placeholder.com/600x400/4285f4/ffffff?text=Consultation+Booking+Widget)

## ✨ Features

- 🔐 **Google OAuth 2.0** authentication
- 📅 **Google Calendar** integration with automatic Meet links
- 📧 **Email confirmations** and 10-minute reminders
- 🗄️ **SQLite database** for booking storage
- 🌐 **Embeddable widget** (iframe and JavaScript)
- 🌍 **Multi-language** support (English/French)
- 📱 **Responsive design**
- 💰 **100% Free** - no paid APIs required

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp env.example .env
# Edit .env with your Google OAuth credentials
```

3. **Start the server:**
```bash
npm start
```

4. **Visit:** `http://localhost:3000`

## 📋 Requirements

- Node.js 14+
- Gmail account (for sending emails)
- Google Cloud Console account (free)

## 🔧 Google Setup (5 minutes)

1. **Google Cloud Console:**
   - Create new project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials

2. **Gmail App Password:**
   - Enable 2FA on Gmail
   - Generate app password

3. **Update `.env` file** with credentials

**👉 [Detailed Setup Instructions](SETUP.md)**

## 🎯 Embed Anywhere

### Simple Iframe
```html
<iframe src="http://localhost:3000/embed" width="500" height="600"></iframe>
```

### JavaScript Widget (Recommended)
```html
<div id="consultation-booking-widget"></div>
<script src="http://localhost:3000/embed.js"></script>
```

### Custom Configuration
```html
<script>
window.ConsultationBookingConfig = {
    language: 'fr',
    theme: 'light',
    width: '100%'
};
</script>
<div id="consultation-booking-widget"></div>
<script src="http://localhost:3000/embed.js"></script>
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/book` | Create booking |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/booking/:id` | Get specific booking |
| GET | `/auth/status` | Check authentication |

## 🔄 How it Works

1. **User books consultation** → fills form with name, email, date/time
2. **System creates Google Calendar event** → with Google Meet link
3. **Confirmation email sent** → with Meet link included
4. **Reminder email** → sent 10 minutes before meeting
5. **Meeting happens** → via generated Google Meet link

## 📱 Screenshots

### Main Booking Page
- Clean, professional interface
- Date/time picker
- Real-time validation
- Multi-language support

### Embeddable Widget
- Compact design
- Fits any website
- Responsive layout
- Custom styling options

### Email Notifications
- Professional templates
- Meeting details included
- Google Meet links
- Automatic reminders

## 🛠️ Customization

### Time Slots
Edit available times in `src/routes/booking.js` and frontend files.

### Email Templates
Customize email designs in `src/services/emailService.js`.

### Languages
Add new languages by extending the translations object in frontend files.

### Styling
Modify CSS in `public/index.html` and `public/embed.html`.

## 🔒 Security Features

- OAuth 2.0 authentication
- Input validation
- SQL injection protection
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### Bookings Table
- `id` - Unique booking ID
- `name` - Customer name
- `email` - Customer email
- `date` - Booking date
- `time` - Booking time
- `meet_link` - Generated Google Meet URL
- `event_id` - Google Calendar event ID
- `status` - Booking status
- `reminder_sent` - Reminder email flag

### Auth Tokens Table
- OAuth token storage
- Automatic refresh handling

## 🚀 Production Deployment

1. **Update environment variables**
2. **Configure domain in Google OAuth**
3. **Set up SSL certificate**
4. **Use process manager (PM2)**
5. **Configure reverse proxy**

See [SETUP.md](SETUP.md) for detailed production deployment instructions.

## 🐛 Troubleshooting

### Common Issues

**"Google Calendar not authenticated"**
→ Visit `/auth/google` to authenticate

**Email not sending**
→ Check Gmail app password and 2FA settings

**Booking failed**
→ Check server logs and database permissions

**OAuth errors**
→ Verify redirect URI and credentials

## 📄 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- 📖 [Setup Guide](SETUP.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

**Made with ❤️ for free consultation bookings worldwide**