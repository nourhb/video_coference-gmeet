#!/usr/bin/env node

// Startup script with better error handling and environment validation
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Consultation Booking Module...');
console.log('==========================================');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
    console.error('❌ Node.js version 14 or higher is required');
    console.error(`   Current version: ${nodeVersion}`);
    process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Load environment variables
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
    'EMAIL_USER',
    'EMAIL_PASS'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.warn('⚠️  Missing environment variables:');
    missingEnvVars.forEach(envVar => {
        console.warn(`   - ${envVar}`);
    });
    console.warn('');
    console.warn('📝 Please set these environment variables or create a .env file');
    console.warn('   See env.example for reference');
    
    // Don't exit in production, just warn
    if (process.env.NODE_ENV !== 'production') {
        console.warn('');
        console.warn('⚠️  Continuing anyway (development mode)');
    }
}

// Set default values
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DB_PATH = process.env.DB_PATH || './database.sqlite';

console.log(`✅ Environment: ${process.env.NODE_ENV}`);
console.log(`✅ Port: ${process.env.PORT}`);
console.log(`✅ Database: ${process.env.DB_PATH}`);

// Create data directory if it doesn't exist
const dbDir = path.dirname(process.env.DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`✅ Created database directory: ${dbDir}`);
}

// Start the server
console.log('');
console.log('🌐 Starting server...');

try {
    require('./server.js');
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting tips:');
    console.error('   1. Ensure all dependencies are installed: npm install');
    console.error('   2. Check your .env file configuration');
    console.error('   3. Verify Google Cloud Console setup');
    console.error('   4. Check the logs above for specific errors');
    console.error('');
    console.error('📖 See SETUP.md for detailed instructions');
    process.exit(1);
}