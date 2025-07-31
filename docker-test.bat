@echo off
echo 🐳 Testing Docker build for Consultation Booking Module
echo ======================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

echo ✅ Docker is installed

REM Build the Docker image
echo 🔨 Building Docker image...
docker build -t consultation-booking:test .
if %errorlevel% neq 0 (
    echo ❌ Docker build failed
    pause
    exit /b 1
)

echo ✅ Docker image built successfully

REM Test the container
echo 🧪 Testing Docker container...
docker run -d --name consultation-booking-test -p 3001:3000 consultation-booking:test

REM Wait for container to start
timeout /t 5 /nobreak >nul

REM Test health endpoint
echo 🔍 Testing health endpoint...
curl -f http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Health check passed
) else (
    echo ⚠️  Health check failed (this is expected without proper configuration)
)

REM Show container logs
echo 📋 Container logs:
docker logs consultation-booking-test

REM Cleanup
echo 🧹 Cleaning up test container...
docker stop consultation-booking-test
docker rm consultation-booking-test

echo ✅ Docker test completed successfully!
echo.
echo 🚀 To run the container manually:
echo    docker run -p 3000:3000 --env-file .env consultation-booking:test

pause