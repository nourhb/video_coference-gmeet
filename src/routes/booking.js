const express = require('express');
const router = express.Router();
const moment = require('moment');

const { createBooking, getAllBookings, getBooking } = require('../database');
const calendarService = require('../services/calendarService');
const { EmailService } = require('../services/emailService');
const googleAuth = require('../services/googleAuth');

const emailService = new EmailService();

// Create a new booking
router.post('/book', async (req, res) => {
    try {
        const { name, email, date, time } = req.body;

        // Validate input
        if (!name || !email || !date || !time) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, date, time' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }

        // Check if Google Calendar is authenticated
        const isAuthenticated = await googleAuth.isAuthenticated();
        if (!isAuthenticated) {
            return res.status(500).json({ 
                error: 'Google Calendar not authenticated. Please contact administrator.' 
            });
        }

        // Combine date and time into datetime
        const datetime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toISOString();
        
        // Check if the datetime is in the future
        if (moment(datetime).isBefore(moment())) {
            return res.status(400).json({ 
                error: 'Cannot book meetings in the past' 
            });
        }

        // Create calendar event with Google Meet link
        const eventData = await calendarService.createMeetingEvent({
            name,
            email,
            datetime,
            duration: 60 // 60 minutes
        });

        if (!eventData.meetLink) {
            throw new Error('Failed to generate Google Meet link');
        }

        // Save booking to database
        const bookingData = {
            name,
            email,
            date,
            time,
            datetime,
            meet_link: eventData.meetLink,
            event_id: eventData.eventId
        };

        const booking = await createBooking(bookingData);

        // Send confirmation email
        try {
            const emailResult = await emailService.sendBookingConfirmation(bookingData);
            if (emailResult.messageId === 'skipped-no-config') {
                console.log('Email notification skipped - no email configuration');
            }
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the booking if email fails
        }

        res.json({
            success: true,
            booking: {
                id: booking.id,
                name: booking.name,
                email: booking.email,
                date: booking.date,
                time: booking.time,
                meet_link: booking.meet_link,
                status: 'confirmed'
            },
            message: 'Booking confirmed! Check your email for the Google Meet link.'
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            error: 'Failed to create booking',
            details: error.message 
        });
    }
});

// Get all bookings (admin)
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get specific booking
router.get('/booking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await getBooking(id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Check available time slots (basic implementation)
router.get('/available-slots', async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ error: 'Date parameter required' });
        }

        // Basic time slots (9 AM to 5 PM, hourly)
        const timeSlots = [
            '09:00', '10:00', '11:00', '12:00', 
            '13:00', '14:00', '15:00', '16:00', '17:00'
        ];

        // In a real implementation, you would check against existing bookings
        // and the Google Calendar to see which slots are actually available
        
        res.json({
            date,
            available_slots: timeSlots
        });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Consultation Booking API'
    });
});

module.exports = router;