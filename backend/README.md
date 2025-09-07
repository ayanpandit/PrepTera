# PrepTera Backend Setup Guide

## Prerequisites
- Node.js >= 18.0.0
- npm or yarn package manager

## Installation Steps

1. Navigate to the backend directory:
   cd backend

2. Install dependencies:
   npm install

3. Set up environment variables:
   - Copy .env.example to .env (if exists) or create .env file
   - Add your Gemini API key to the .env file:
     GEMINI_API_KEY=your_actual_api_key_here

4. Start the development server:
   npm run dev

   Or for production:
   npm start

## Environment Variables

GEMINI_API_KEY=your_gemini_api_key_here  # Required: Get from Google AI Studio
PORT=3000                                # Optional: Server port (default: 3000)
NODE_ENV=development                     # Optional: Environment mode
ALLOWED_ORIGINS=http://localhost:5173    # Optional: CORS origins

## API Endpoints

POST /start     - Start a new interview session
POST /answer    - Submit an answer and get next question
POST /feedback  - Get final interview feedback
GET  /health    - Health check endpoint

## Dependencies

express@^4.18.2      # Web framework
cors@^2.8.5          # CORS middleware
dotenv@^16.3.1       # Environment variables
node-fetch@^3.3.2    # HTTP client for Gemini API

## Dev Dependencies

nodemon@^3.0.1       # Development auto-reload
