const { google } = require('googleapis');
const googleAuth = require('./googleAuth');

class CalendarService {
    constructor() {
        this.calendar = google.calendar({ version: 'v3' });
    }

    async createMeetingEvent(bookingData) {
        try {
            const { name, email, datetime, duration = 60 } = bookingData;
            
            // Ensure we're authenticated
            const isAuth = await googleAuth.isAuthenticated();
            if (!isAuth) {
                throw new Error('Not authenticated with Google Calendar');
            }

            const oauth2Client = googleAuth.getOAuth2Client();
            
            // Parse the datetime
            const startTime = new Date(datetime);
            const endTime = new Date(startTime.getTime() + duration * 60000); // Add duration in minutes

            const event = {
                summary: `Consultation with ${name}`,
                description: `Free consultation meeting with ${name} (${email})`,
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: 'UTC',
                },
                attendees: [
                    { email: email }
                ],
                conferenceData: {
                    createRequest: {
                        requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        conferenceSolutionKey: {
                            type: 'hangoutsMeet'
                        }
                    }
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 10 },
                        { method: 'popup', minutes: 10 }
                    ]
                }
            };

            const response = await this.calendar.events.insert({
                auth: oauth2Client,
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1,
                sendUpdates: 'all' // Send invites to attendees
            });

            const createdEvent = response.data;
            const meetLink = createdEvent.conferenceData?.entryPoints?.find(
                entry => entry.entryPointType === 'video'
            )?.uri;

            return {
                eventId: createdEvent.id,
                meetLink: meetLink,
                eventDetails: createdEvent
            };

        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    }

    async updateEvent(eventId, updates) {
        try {
            const oauth2Client = googleAuth.getOAuth2Client();
            
            const response = await this.calendar.events.patch({
                auth: oauth2Client,
                calendarId: 'primary',
                eventId: eventId,
                resource: updates
            });

            return response.data;
        } catch (error) {
            console.error('Error updating calendar event:', error);
            throw error;
        }
    }

    async deleteEvent(eventId) {
        try {
            const oauth2Client = googleAuth.getOAuth2Client();
            
            await this.calendar.events.delete({
                auth: oauth2Client,
                calendarId: 'primary',
                eventId: eventId
            });

            return true;
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            throw error;
        }
    }

    async getEvent(eventId) {
        try {
            const oauth2Client = googleAuth.getOAuth2Client();
            
            const response = await this.calendar.events.get({
                auth: oauth2Client,
                calendarId: 'primary',
                eventId: eventId
            });

            return response.data;
        } catch (error) {
            console.error('Error getting calendar event:', error);
            throw error;
        }
    }

    async listUpcomingEvents(maxResults = 10) {
        try {
            const oauth2Client = googleAuth.getOAuth2Client();
            
            const response = await this.calendar.events.list({
                auth: oauth2Client,
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime'
            });

            return response.data.items || [];
        } catch (error) {
            console.error('Error listing calendar events:', error);
            throw error;
        }
    }
}

module.exports = new CalendarService();