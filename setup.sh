#!/bin/bash

# Quick Start Script for Vendor Discovery Platform
# This script helps you set up the project quickly

set -e

echo "🚀 Vendor Discovery Platform - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your API keys:"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - BRAVE_SEARCH_API_KEY"
    echo "   - DATABASE_URL"
    echo ""
    echo "Press ENTER when you've added your API keys..."
    read
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if DATABASE_URL is set
if grep -q "postgresql://user:password@localhost" .env; then
    echo "⚠️  Warning: DATABASE_URL appears to be using default values"
    echo "   Make sure your database is configured correctly"
fi

# Setup database
echo ""
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "To check system health:"
echo "  Open http://localhost:3000/status after starting"
echo ""
echo "To deploy with Docker:"
echo "  docker-compose up --build"
echo ""
