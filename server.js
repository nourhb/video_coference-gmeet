const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import modules
const { initializeDatabase } = require('./src/database');
const authRoutes = require('./src/routes/auth');
const bookingRoutes = require('./src/routes/booking');
const { sendEmailReminders } = require('./src/services/emailService');

// Initialize database
initializeDatabase();

// Routes
app.use('/auth', authRoutes);
app.use('/api', bookingRoutes);

// Serve the booking widget
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Embed endpoint for iframe
app.get('/embed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'embed.html'));
});

// Admin endpoint
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Schedule email reminders (runs every minute to check for upcoming meetings)
cron.schedule('* * * * *', () => {
    sendEmailReminders();
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Booking widget available at: http://localhost:${PORT}`);
    console.log(`Embeddable widget at: http://localhost:${PORT}/embed`);
});

module.exports = app;