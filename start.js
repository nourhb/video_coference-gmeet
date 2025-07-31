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

// Check optional environment variables (only for enhanced features)
const optionalEnvVars = [
    'EMAIL_USER',
    'EMAIL_PASS'
];

const missingOptionalVars = optionalEnvVars.filter(envVar => !process.env[envVar]);

if (missingOptionalVars.length > 0) {
    console.log('📝 Optional features not configured:');
    if (missingOptionalVars.includes('EMAIL_USER') || missingOptionalVars.includes('EMAIL_PASS')) {
        console.log('   - Email notifications (EMAIL_USER, EMAIL_PASS)');
    }
    console.log('');
    console.log('✅ Core booking system will work without these');
    console.log('📧 Email notifications will be disabled');
}

// Set NODE_ENV to production if PORT is set (indicates cloud deployment)
if (process.env.PORT && !process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
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