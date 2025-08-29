#!/bin/bash

# Build and Run Bhasa Con Application with Docker

set -e

echo "🚀 Building and running Bhasa Con application..."

# Stop any running containers
echo "📦 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build

echo "✅ Application is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"