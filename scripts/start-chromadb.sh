#!/bin/bash

echo "🚀 Starting ChromaDB Server..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo "On macOS: Open Docker Desktop from Applications"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p packages/backend/storage/chroma-data

echo "✅ Docker is running"
echo "📦 Pulling ChromaDB image..."

# Pull the image
docker pull chromadb/chroma:latest

echo ""
echo "🔧 Starting ChromaDB container..."

# Stop any existing container
docker stop chromadb 2>/dev/null
docker rm chromadb 2>/dev/null

# Run ChromaDB
docker run -d \
  --name chromadb \
  -p 8000:8000 \
  -v "$(pwd)/packages/backend/storage/chroma-data:/chroma/chroma" \
  -e ANONYMIZED_TELEMETRY=False \
  -e ALLOW_RESET=True \
  chromadb/chroma:latest

echo ""
echo "⏳ Waiting for ChromaDB to start..."
sleep 5

# Test connection
if curl -s http://localhost:8000/api/v1/heartbeat > /dev/null 2>&1; then
    echo ""
    echo "✅ ✅ ✅ ChromaDB is running successfully! ✅ ✅ ✅"
    echo ""
    echo "📊 ChromaDB URL: http://localhost:8000"
    echo "📁 Data stored in: packages/backend/storage/chroma-data"
    echo ""
    echo "To stop: docker stop chromadb"
    echo "To view logs: docker logs -f chromadb"
    echo ""
    echo "Now restart your backend server:"
    echo "  cd packages/backend && npm run dev"
else
    echo ""
    echo "⚠️  ChromaDB started but not responding yet"
    echo "Check logs: docker logs chromadb"
fi

