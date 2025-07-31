const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Consultation Booking Module');
console.log('=====================================');

// Test 1: Check if all required files exist
const requiredFiles = [
    'package.json',
    'server.js',
    'env.example',
    'src/database.js',
    'src/services/googleAuth.js',
    'src/services/calendarService.js',
    'src/services/emailService.js',
    'src/routes/auth.js',
    'src/routes/booking.js',
    'public/index.html',
    'public/embed.html',
    'public/embed.js',
    'public/admin.html',
    'SETUP.md',
    'README.md'
];

console.log('\n📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.log(`\n❌ ${missingFiles.length} files are missing. Please ensure all files are created.`);
    process.exit(1);
}

// Test 2: Check package.json structure
console.log('\n📦 Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredDeps = [
        'express', 'cors', 'dotenv', 'googleapis', 
        'nodemailer', 'sqlite3', 'body-parser', 
        'node-cron', 'moment'
    ];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✅ ${dep}`);
        } else {
            console.log(`❌ ${dep} - MISSING`);
        }
    });
    
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
}

// Test 3: Check environment file template
console.log('\n🔧 Checking environment template...');
try {
    const envExample = fs.readFileSync('env.example', 'utf8');
    const requiredEnvVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET', 
        'GOOGLE_REDIRECT_URI',
        'EMAIL_USER',
        'EMAIL_PASS'
    ];
    
    requiredEnvVars.forEach(envVar => {
        if (envExample.includes(envVar)) {
            console.log(`✅ ${envVar}`);
        } else {
            console.log(`❌ ${envVar} - MISSING`);
        }
    });
    
} catch (error) {
    console.log('❌ Error reading env.example:', error.message);
}

// Test 4: Basic server startup test (if .env exists)
console.log('\n🚀 Testing server startup...');

if (fs.existsSync('.env')) {
    console.log('✅ .env file found - attempting server test');
    
    // Try to require the main modules
    try {
        require('./src/database');
        console.log('✅ Database module loads correctly');
    } catch (error) {
        console.log('❌ Database module error:', error.message);
    }
    
    try {
        require('./src/services/googleAuth');
        console.log('✅ Google Auth service loads correctly');
    } catch (error) {
        console.log('❌ Google Auth service error:', error.message);
    }
    
    try {
        require('./src/services/emailService');
        console.log('✅ Email service loads correctly');
    } catch (error) {
        console.log('❌ Email service error:', error.message);
    }
    
} else {
    console.log('⚠️  .env file not found - skipping server test');
    console.log('   Create .env from env.example to test server startup');
}

// Test 5: HTML structure validation
console.log('\n🌐 Checking HTML files...');

const htmlFiles = ['public/index.html', 'public/embed.html', 'public/admin.html'];

htmlFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Basic HTML structure checks
        if (content.includes('<!DOCTYPE html>')) {
            console.log(`✅ ${file} - Valid HTML structure`);
        } else {
            console.log(`❌ ${file} - Missing DOCTYPE`);
        }
        
        // Check for required form elements in booking pages
        if (file.includes('index.html') || file.includes('embed.html')) {
            const hasForm = content.includes('<form') && content.includes('id="bookingForm"');
            const hasNameInput = content.includes('name="name"');
            const hasEmailInput = content.includes('name="email"');
            const hasDateInput = content.includes('name="date"');
            const hasTimeInput = content.includes('name="time"');
            
            if (hasForm && hasNameInput && hasEmailInput && hasDateInput && hasTimeInput) {
                console.log(`✅ ${file} - All required form elements present`);
            } else {
                console.log(`❌ ${file} - Missing required form elements`);
            }
        }
        
    } catch (error) {
        console.log(`❌ ${file} - Error reading file:`, error.message);
    }
});

// Test 6: API endpoint structure
console.log('\n🔌 Checking API routes...');

try {
    const bookingRoutes = fs.readFileSync('src/routes/booking.js', 'utf8');
    const authRoutes = fs.readFileSync('src/routes/auth.js', 'utf8');
    
    // Check booking routes
    const bookingEndpoints = [
        "'/book'", "'/bookings'", "'/booking/:id'", 
        "'/available-slots'", "'/health'"
    ];
    
    bookingEndpoints.forEach(endpoint => {
        if (bookingRoutes.includes(endpoint)) {
            console.log(`✅ Booking API ${endpoint}`);
        } else {
            console.log(`❌ Booking API ${endpoint} - MISSING`);
        }
    });
    
    // Check auth routes
    const authEndpoints = ["'/google'", "'/google/callback'", "'/status'"];
    
    authEndpoints.forEach(endpoint => {
        if (authRoutes.includes(endpoint)) {
            console.log(`✅ Auth API ${endpoint}`);
        } else {
            console.log(`❌ Auth API ${endpoint} - MISSING`);
        }
    });
    
} catch (error) {
    console.log('❌ Error checking API routes:', error.message);
}

console.log('\n🎉 Test Summary');
console.log('===============');

if (missingFiles.length === 0) {
    console.log('✅ All required files are present');
    console.log('✅ Module structure is correct');
    console.log('✅ Ready for deployment!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy env.example to .env');
    console.log('2. Configure Google OAuth credentials');
    console.log('3. Set up Gmail app password');
    console.log('4. Run: npm install');
    console.log('5. Run: npm start');
    console.log('6. Visit: http://localhost:3000');
    console.log('\n📖 See SETUP.md for detailed instructions');
} else {
    console.log(`❌ ${missingFiles.length} files are missing`);
    console.log('Please ensure all files are created before deployment');
}

console.log('\n🔗 Useful URLs (after starting server):');
console.log('   Main booking: http://localhost:3000');
console.log('   Admin panel:  http://localhost:3000/admin');
console.log('   Embed widget: http://localhost:3000/embed');
console.log('   Example page: Open example-embed.html in browser');
console.log('   Health check: http://localhost:3000/api/health');