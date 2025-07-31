@echo off
echo 🚀 Consultation Booking Module - Windows Installation
echo =====================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from template...
    copy env.example .env
    echo 📝 Please edit .env file with your configuration:
    echo    - Google OAuth credentials
    echo    - Gmail settings
    echo    - Server configuration
    echo.
    echo 📖 See SETUP.md for detailed instructions
    echo.
    echo After editing .env, run: npm start
    pause
    exit /b 0
)

echo ✅ Environment file found

REM Run tests
echo 🧪 Running tests...
node test.js

echo.
echo 🌐 Starting server...
echo 📊 Visit these URLs after server starts:
echo    Main booking: http://localhost:3000
echo    Admin panel:  http://localhost:3000/admin
echo    Embed widget: http://localhost:3000/embed
echo.

REM Start the server
npm start

pause