const nodemailer = require('nodemailer');
const { getUpcomingBookings, markReminderSent } = require('../database');

class EmailService {
    constructor() {
        // Check if email configuration is available
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️  Email configuration missing. Email notifications will be disabled.');
            this.transporter = null;
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendBookingConfirmation(bookingData) {
        if (!this.transporter) {
            console.warn('⚠️  Email transporter not configured. Skipping confirmation email.');
            return { messageId: 'skipped-no-config' };
        }

        try {
            const { name, email, date, time, meet_link } = bookingData;
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Consultation Booking Confirmed - Meet Link Included',
                html: this.getBookingConfirmationTemplate(name, date, time, meet_link)
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Booking confirmation email sent:', result.messageId);
            return result;
        } catch (error) {
            console.error('Error sending booking confirmation email:', error);
            throw error;
        }
    }

    async sendReminder(bookingData) {
        if (!this.transporter) {
            console.warn('⚠️  Email transporter not configured. Skipping reminder email.');
            return { messageId: 'skipped-no-config' };
        }

        try {
            const { name, email, date, time, meet_link } = bookingData;
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Reminder: Your consultation starts in 10 minutes',
                html: this.getReminderTemplate(name, date, time, meet_link)
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Reminder email sent:', result.messageId);
            return result;
        } catch (error) {
            console.error('Error sending reminder email:', error);
            throw error;
        }
    }

    getBookingConfirmationTemplate(name, date, time, meetLink) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4285f4; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .meeting-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .meet-link { background: #4285f4; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
                .meet-link a { color: white; text-decoration: none; font-weight: bold; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Consultation Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Hello ${name},</p>
                    <p>Your free consultation has been successfully booked. Here are the details:</p>
                    
                    <div class="meeting-details">
                        <h3>Meeting Details</h3>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Duration:</strong> 60 minutes</p>
                    </div>

                    <div class="meet-link">
                        <p><strong>Join the meeting:</strong></p>
                        <a href="${meetLink}" target="_blank">Click here to join Google Meet</a>
                    </div>

                    <p><strong>What to expect:</strong></p>
                    <ul>
                        <li>You'll receive a reminder email 10 minutes before the meeting</li>
                        <li>The meeting link will remain active for the duration of your session</li>
                        <li>Please test your camera and microphone beforehand</li>
                    </ul>

                    <p>If you need to reschedule or have any questions, please reply to this email.</p>
                    
                    <p>Looking forward to speaking with you!</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    getReminderTemplate(name, date, time, meetLink) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .meet-link { background: #4285f4; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
                .meet-link a { color: white; text-decoration: none; font-weight: bold; font-size: 18px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⏰ Meeting Reminder</h1>
                </div>
                <div class="content">
                    <p>Hello ${name},</p>
                    
                    <div class="urgent">
                        <h3>🚨 Your consultation starts in 10 minutes!</h3>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                    </div>

                    <div class="meet-link">
                        <p><strong>Join now:</strong></p>
                        <a href="${meetLink}" target="_blank">🎥 JOIN GOOGLE MEET</a>
                    </div>

                    <p><strong>Quick checklist:</strong></p>
                    <ul>
                        <li>✅ Test your camera and microphone</li>
                        <li>✅ Find a quiet, well-lit space</li>
                        <li>✅ Have any questions or materials ready</li>
                        <li>✅ Join a few minutes early</li>
                    </ul>

                    <p>See you soon!</p>
                </div>
                <div class="footer">
                    <p>This is an automated reminder. Please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

// Function to send email reminders (called by cron job)
async function sendEmailReminders() {
    try {
        const upcomingBookings = await getUpcomingBookings(10); // 10 minutes before
        
        if (upcomingBookings.length > 0) {
            console.log(`Found ${upcomingBookings.length} upcoming bookings for reminders`);
            
            const emailService = new EmailService();
            
            // Skip if email is not configured
            if (!emailService.transporter) {
                console.log('Email not configured, skipping reminders');
                return;
            }
            
            for (const booking of upcomingBookings) {
                try {
                    await emailService.sendReminder(booking);
                    await markReminderSent(booking.id);
                    console.log(`Reminder sent for booking ${booking.id}`);
                } catch (error) {
                    console.error(`Failed to send reminder for booking ${booking.id}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error in sendEmailReminders:', error);
    }
}

module.exports = {
    EmailService,
    sendEmailReminders
};