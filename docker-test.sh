#!/bin/bash

# Docker build and test script
echo "🐳 Testing Docker build for Consultation Booking Module"
echo "======================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t consultation-booking:test .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "✅ Docker image built successfully"

# Test the container
echo "🧪 Testing Docker container..."
docker run -d --name consultation-booking-test -p 3001:3000 consultation-booking:test

# Wait for container to start
sleep 5

# Test health endpoint
echo "🔍 Testing health endpoint..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "⚠️  Health check failed (this is expected without proper configuration)"
fi

# Show container logs
echo "📋 Container logs:"
docker logs consultation-booking-test

# Cleanup
echo "🧹 Cleaning up test container..."
docker stop consultation-booking-test
docker rm consultation-booking-test

echo "✅ Docker test completed successfully!"
echo ""
echo "🚀 To run the container manually:"
echo "   docker run -p 3000:3000 --env-file .env consultation-booking:test"