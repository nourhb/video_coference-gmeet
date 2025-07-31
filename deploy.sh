#!/bin/bash

# Consultation Booking Module - Deployment Script
# This script helps deploy the application to production

echo "🚀 Consultation Booking Module - Deployment Script"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your configuration:"
    echo "   - Google OAuth credentials"
    echo "   - Gmail settings"
    echo "   - Server configuration"
    echo ""
    echo "After editing .env, run this script again."
    exit 0
fi

echo "✅ Environment file found"

# Create database directory if it doesn't exist
mkdir -p data

# Check if production environment
if [ "$NODE_ENV" = "production" ]; then
    echo "🏭 Production deployment detected"
    
    # Install PM2 if not already installed
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Installing PM2 process manager..."
        npm install -g pm2
    fi
    
    # Start application with PM2
    echo "🚀 Starting application with PM2..."
    pm2 start server.js --name consultation-booking
    pm2 startup
    pm2 save
    
    echo "✅ Application started with PM2"
    echo "📊 Use 'pm2 status' to check application status"
    echo "📋 Use 'pm2 logs consultation-booking' to view logs"
    
else
    echo "🛠️  Development deployment"
    echo "🚀 Starting application in development mode..."
    npm run dev &
    
    # Wait a moment for server to start
    sleep 3
    
    echo "✅ Application started successfully!"
fi

echo ""
echo "🌐 Application URLs:"
echo "   Main booking page: http://localhost:3000"
echo "   Admin panel: http://localhost:3000/admin"
echo "   Embeddable widget: http://localhost:3000/embed"
echo "   Health check: http://localhost:3000/api/health"
echo ""
echo "📚 Next steps:"
echo "   1. Visit http://localhost:3000/admin to authenticate with Google"
echo "   2. Test the booking system"
echo "   3. Embed the widget on your website"
echo ""
echo "📖 For detailed setup instructions, see SETUP.md"
echo "🆘 For troubleshooting, check the logs and SETUP.md"

echo "✨ Deployment completed successfully!"