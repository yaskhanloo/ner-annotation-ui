#!/bin/bash
# Simple deployment script for NER Annotation Tool

echo "🚀 Deploying NER Annotation Tool..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Install Docker Compose first."
    exit 1
fi

# Deploy
echo "🔨 Building and starting..."
docker-compose up -d --build

# Wait and test
echo "⏳ Waiting for startup..."
sleep 10

if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "✅ Success! Access at: http://localhost:3001"
    echo ""
    echo "Commands:"
    echo "  docker-compose logs -f  # View logs"
    echo "  docker-compose down     # Stop"
else
    echo "❌ Health check failed. Check logs: docker-compose logs"
fi