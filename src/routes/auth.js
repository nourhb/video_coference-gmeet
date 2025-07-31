const express = require('express');
const router = express.Router();
const googleAuth = require('../services/googleAuth');

// Route to initiate Google OAuth
router.get('/google', (req, res) => {
    const authUrl = googleAuth.getAuthUrl();
    res.redirect(authUrl);
});

// OAuth callback route
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
    }

    try {
        const tokens = await googleAuth.getTokens(code);
        console.log('OAuth tokens received and saved');
        
        // Redirect to admin page or success page
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect('/?auth=error');
    }
});

// Check authentication status
router.get('/status', async (req, res) => {
    try {
        const isAuthenticated = await googleAuth.isAuthenticated();
        res.json({ authenticated: isAuthenticated });
    } catch (error) {
        console.error('Error checking auth status:', error);
        res.status(500).json({ error: 'Failed to check authentication status' });
    }
});

module.exports = router;