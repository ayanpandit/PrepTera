@echo off
echo 🚀 Starting PrepTera Development Environment...

REM Check if we're in the correct directory
if not exist "frontend" (
    if not exist "backend" (
        echo ❌ Please run this script from the PrepTera root directory
        pause
        exit /b 1
    )
)

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Setup Backend
echo 📦 Setting up backend...
cd backend

REM Create .env if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ⚠️  Created .env from .env.example. Please update with your actual API keys.
    ) else (
        echo ❌ No .env.example found in backend directory
        pause
        exit /b 1
    )
)

REM Install backend dependencies
if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    npm install
)

REM Start backend in background
echo 🟢 Starting backend server...
start "PrepTera Backend" cmd /k "npm start"

cd ..

REM Setup Frontend
echo 📦 Setting up frontend...
cd frontend

REM Create .env if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ Created frontend .env from .env.example
    )
)

REM Install frontend dependencies
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start frontend
echo 🟢 Starting frontend development server...
start "PrepTera Frontend" cmd /k "npm run dev"

cd ..

echo.
echo 🎉 PrepTera is starting up!
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend: http://localhost:3000
echo.
echo Close the terminal windows to stop the servers
pause
