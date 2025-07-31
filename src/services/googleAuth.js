// Disabled Google Auth Service - No longer required
// This file is kept for compatibility but authentication is disabled

class GoogleAuthService {
    constructor() {
        // No authentication required - simple meeting system active
        console.log('🚀 Simple meeting system active - no authentication required');
    }

    async initializeWithStoredTokens() {
        // No tokens needed - using direct meeting links
        return;
    }

    getAuthUrl() {
        return '#auth-disabled';
    }

    async getTokens(code) {
        return { message: 'Authentication disabled - using simple meeting system' };
    }

    async refreshTokens() {
        return { message: 'Authentication disabled - using simple meeting system' };
    }

    getOAuth2Client() {
        return null;
    }

    async isAuthenticated() {
        // Always return true since no authentication is required
        return true;
    }
}

module.exports = new GoogleAuthService();