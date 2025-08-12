#!/bin/bash

# NER Annotation Tool - Quick Deploy Script
set -e

echo "🚀 NER Annotation Tool - Docker Deployment"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if port 3001 is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3001 is already in use. Please stop the service using this port."
    echo "   You can check what's using it with: lsof -i :3001"
    read -p "   Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build and start the application
echo ""
echo "🔨 Building and starting the application..."
docker-compose up -d --build

# Wait for the application to start
echo ""
echo "⏳ Waiting for the application to start..."
sleep 10

# Health check
echo ""
echo "🔍 Performing health check..."
if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo ""
    echo "🌐 Access the application at:"
    echo "   📱 Web Interface: http://localhost:3001"
    echo "   🔧 Health Check:  http://localhost:3001/api/health"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:        docker-compose logs -f"
    echo "   Stop application: docker-compose down"
    echo "   Restart:          docker-compose restart"
    echo ""
    echo "📖 For more information, see DOCKER_README.md"
else
    echo "❌ Health check failed. The application might not be ready yet."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   Check logs: docker-compose logs"
    echo "   Try again:  curl http://localhost:3001/api/health"
    echo ""
    echo "   If the issue persists, please check the logs for errors."
fi

echo ""
echo "🎉 Deployment complete!"