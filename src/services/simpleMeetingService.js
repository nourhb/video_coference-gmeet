const crypto = require('crypto');

class SimpleMeetingService {
    constructor() {
        // No authentication required
    }

    /**
     * Generate a simple meeting room link
     * This creates a unique meeting room that can be used by any video conferencing service
     */
    generateMeetingRoom(bookingData) {
        const { name, email, datetime } = bookingData;
        
        // Generate a unique meeting ID
        const meetingId = this.generateMeetingId(name, email, datetime);
        
        // You can customize these URLs based on your preferred video service
        const meetingOptions = {
            // Jitsi Meet (free, no account required)
            jitsi: `https://meet.jit.si/ConsultationRoom-${meetingId}`,
            
            // BigBlueButton (if you have a server)
            // bbb: `https://your-bbb-server.com/b/consultation-${meetingId}`,
            
            // Custom meeting room
            custom: `https://meet.yourdomain.com/room/${meetingId}`,
            
            // Simple meeting room page (we'll create this)
            simple: `/meeting/${meetingId}`
        };

        return {
            meetingId: meetingId,
            meetingLink: meetingOptions.jitsi, // Default to Jitsi Meet
            meetingOptions: meetingOptions,
            roomName: `Consultation with ${name}`,
            instructions: this.getMeetingInstructions(meetingOptions.jitsi)
        };
    }

    /**
     * Generate a unique meeting ID based on booking details
     */
    generateMeetingId(name, email, datetime) {
        const baseString = `${name}-${email}-${datetime}`;
        const hash = crypto.createHash('md5').update(baseString).digest('hex');
        return hash.substring(0, 12); // 12 character unique ID
    }

    /**
     * Get meeting instructions for users
     */
    getMeetingInstructions(meetingLink) {
        return {
            beforeMeeting: [
                "Test your camera and microphone",
                "Find a quiet, well-lit space",
                "Have a stable internet connection",
                "Join a few minutes early"
            ],
            duringMeeting: [
                "Click the meeting link to join",
                "Allow camera and microphone permissions",
                "Introduce yourself when you join",
                "Use mute when not speaking"
            ],
            troubleshooting: [
                "If the link doesn't work, try refreshing the page",
                "Check your browser allows camera/microphone access",
                "Try a different browser if you have issues",
                "Contact support if problems persist"
            ]
        };
    }

    /**
     * Create a meeting room without any external API
     */
    createSimpleMeeting(bookingData) {
        const meetingRoom = this.generateMeetingRoom(bookingData);
        
        // Return meeting details
        return {
            success: true,
            meetingId: meetingRoom.meetingId,
            meetingLink: meetingRoom.meetingLink,
            roomName: meetingRoom.roomName,
            instructions: meetingRoom.instructions,
            alternatives: meetingRoom.meetingOptions
        };
    }

    /**
     * Get alternative meeting services
     */
    getAlternativeMeetingServices() {
        return [
            {
                name: "Jitsi Meet",
                url: "https://meet.jit.si/",
                description: "Free, no account required",
                features: ["Screen sharing", "Chat", "Recording"]
            },
            {
                name: "Whereby",
                url: "https://whereby.com/",
                description: "Browser-based, free for small groups",
                features: ["Custom room names", "Screen sharing", "Chat"]
            },
            {
                name: "BigBlueButton",
                url: "https://bigbluebutton.org/",
                description: "Open source, self-hosted option",
                features: ["Whiteboard", "Breakout rooms", "Polls"]
            },
            {
                name: "Discord",
                url: "https://discord.com/",
                description: "Gaming-focused but works for meetings",
                features: ["Voice channels", "Screen sharing", "Text chat"]
            }
        ];
    }

    /**
     * Validate a meeting ID
     */
    isValidMeetingId(meetingId) {
        return /^[a-f0-9]{12}$/.test(meetingId);
    }

    /**
     * Get meeting details from ID
     */
    getMeetingFromId(meetingId) {
        if (!this.isValidMeetingId(meetingId)) {
            return null;
        }

        return {
            meetingId: meetingId,
            meetingLink: `https://meet.jit.si/ConsultationRoom-${meetingId}`,
            roomName: `Consultation Room ${meetingId}`,
            status: 'active'
        };
    }
}

module.exports = new SimpleMeetingService();