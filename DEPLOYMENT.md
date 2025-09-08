# PrepTera Deployment Guide for Render

This guide explains how to deploy PrepTera's frontend and backend to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Gemini API Key**: Obtain from Google AI Studio

## Deployment Methods

### Method 1: Automated Deployment with render.yaml

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Connect to Render**:
   - Go to Render Dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your PrepTera code

3. **Configure Environment Variables**:
   - **For Backend Service**:
     - `GEMINI_API_KEY`: Your actual Gemini API key
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `ALLOWED_ORIGINS`: https://your-frontend-url.onrender.com

   - **For Frontend Service**:
     - `VITE_API_BASE_URL`: https://your-backend-url.onrender.com
     - Other variables are auto-configured from render.yaml

4. **Deploy**: Render will automatically deploy both services

### Method 2: Manual Deployment

#### Backend Deployment

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set Root Directory: `backend`

2. **Configure Build & Start**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

3. **Set Environment Variables**:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   PORT=10000
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   ```

#### Frontend Deployment

1. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Set Root Directory: `frontend`

2. **Configure Build**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_APP_NAME=PrepTera
   VITE_ENABLE_VOICE_RECOGNITION=true
   VITE_NODE_ENV=production
   ```

4. **Configure Redirects**:
   - Add rewrite rule: `/*` → `/index.html` (for SPA routing)

## Environment Variables Setup

### Backend (.env.production)
```bash
GEMINI_API_KEY=your_production_gemini_api_key_here
PORT=10000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.onrender.com
```

### Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_APP_NAME=PrepTera
VITE_APP_VERSION=1.0.0
VITE_ENABLE_VOICE_RECOGNITION=true
VITE_ENABLE_ANALYTICS=true
VITE_NODE_ENV=production
```

## Important Notes

### 1. Update CORS Origins
After deployment, update the backend's `ALLOWED_ORIGINS` environment variable with your actual frontend URL.

### 2. Frontend API URL
Update the frontend's `VITE_API_BASE_URL` with your actual backend URL.

### 3. Domain Configuration
- Backend will be available at: `https://your-backend-name.onrender.com`
- Frontend will be available at: `https://your-frontend-name.onrender.com`

### 4. Free Tier Limitations
- Services may sleep after inactivity
- Cold starts may cause initial delays
- Consider upgrading for production use

## Verification Steps

1. **Backend Health Check**: Visit `https://your-backend-url.onrender.com/health`
2. **Frontend Access**: Visit your frontend URL
3. **Interview Flow**: Test complete interview functionality
4. **Voice Recognition**: Verify microphone permissions work

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ALLOWED_ORIGINS` includes your frontend URL
2. **API Connection**: Verify `VITE_API_BASE_URL` points to correct backend
3. **Build Failures**: Check Node.js version compatibility (18+ required)
4. **Voice Issues**: Ensure HTTPS is enabled (required for microphone access)

### Logs

- Backend logs: Available in Render service dashboard
- Frontend logs: Check browser console

## Security Considerations

1. **Environment Variables**: Never commit actual API keys to Git
2. **CORS**: Restrict origins to only your frontend domains
3. **HTTPS**: Always use HTTPS in production
4. **API Keys**: Rotate API keys regularly

## Scaling

For high traffic, consider:
- Upgrading to paid Render plans
- Adding Redis for session storage
- Implementing rate limiting
- Using CDN for static assets
