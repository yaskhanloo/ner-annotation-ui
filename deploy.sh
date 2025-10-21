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

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Created .env from .env.example"
        echo "💡 Please review and update .env with your configuration"
    else
        echo "❌ No .env.example found. Please create .env manually."
        exit 1
    fi
fi

# Load environment variables
source .env 2>/dev/null || true
PORT=${PORT:-3001}

# Deploy
echo "🔨 Building and starting..."
docker-compose up -d --build

# Wait and test
echo "⏳ Waiting for startup..."
sleep 10

if curl -f http://localhost:${PORT}/api/health >/dev/null 2>&1; then
    echo "✅ Success! Access at: http://localhost:${PORT}"
    echo ""
    echo "Commands:"
    echo "  docker-compose logs -f  # View logs"
    echo "  docker-compose down     # Stop"
    echo "  docker-compose restart  # Restart"
else
    echo "❌ Health check failed. Check logs: docker-compose logs"
    echo "💡 Make sure port ${PORT} is available"
fi