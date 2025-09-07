@echo off
echo Starting PrepTera Backend Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and add your Gemini API key
    echo.
    pause
    exit /b 1
)

echo Starting server in development mode...
npm run dev
