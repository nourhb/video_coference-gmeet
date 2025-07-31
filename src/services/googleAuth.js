const { google } = require('googleapis');
const { saveAuthTokens, getAuthTokens } = require('../database');

class GoogleAuthService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // Initialize with stored tokens if available
        this.initializeWithStoredTokens();
    }

    async initializeWithStoredTokens() {
        try {
            const storedTokens = await getAuthTokens();
            if (storedTokens) {
                this.oauth2Client.setCredentials({
                    access_token: storedTokens.access_token,
                    refresh_token: storedTokens.refresh_token,
                    expiry_date: storedTokens.expires_at
                });
            }
        } catch (error) {
            console.log('No stored tokens found or error loading them:', error.message);
        }
    }

    getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent' // This ensures we get a refresh token
        });
    }

    async getTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            
            // Save tokens to database
            await saveAuthTokens(tokens);
            
            return tokens;
        } catch (error) {
            console.error('Error getting tokens:', error);
            throw error;
        }
    }

    async refreshTokens() {
        try {
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            this.oauth2Client.setCredentials(credentials);
            
            // Save refreshed tokens to database
            await saveAuthTokens(credentials);
            
            return credentials;
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            throw error;
        }
    }

    getOAuth2Client() {
        return this.oauth2Client;
    }

    async isAuthenticated() {
        try {
            const storedTokens = await getAuthTokens();
            if (!storedTokens) return false;

            // Check if token is expired
            const now = Date.now();
            if (storedTokens.expires_at && storedTokens.expires_at < now) {
                // Try to refresh
                if (storedTokens.refresh_token) {
                    await this.refreshTokens();
                    return true;
                }
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }
}

module.exports = new GoogleAuthService();