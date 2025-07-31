// Disabled Calendar Service - No longer required
// This file is kept for compatibility but Google Calendar is disabled

class CalendarService {
    constructor() {
        console.log('📅 Calendar service disabled - using simple meeting system');
    }

    async createMeetingEvent(bookingData) {
        // This method is disabled - use SimpleMeetingService instead
        throw new Error('Google Calendar disabled - use SimpleMeetingService for direct meeting links');
    }

    async updateEvent(eventId, updates) {
        return { message: 'Calendar service disabled' };
    }

    async deleteEvent(eventId) {
        return { message: 'Calendar service disabled' };
    }

    async getEvent(eventId) {
        return { message: 'Calendar service disabled' };
    }

    async listUpcomingEvents(maxResults = 10) {
        return [];
    }
}

module.exports = new CalendarService();