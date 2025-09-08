#!/bin/bash

# PrepTera Development Startup Script

echo "🚀 Starting PrepTera Development Environment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo "❌ Please run this script from the PrepTera root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "⚠️  Created .env from .env.example. Please update with your actual API keys."
    else
        echo "❌ No .env.example found in backend directory"
        exit 1
    fi
fi

# Install backend dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend in background
echo "🟢 Starting backend server..."
npm start &
BACKEND_PID=$!

cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created frontend .env from .env.example"
    fi
fi

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🟢 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 PrepTera is starting up!"
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit 0' INT

# Keep script running
wait
