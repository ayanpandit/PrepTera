# PrepTera Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All code committed and pushed to GitHub
- [ ] `.gitignore` properly configured
- [ ] Environment files created (`.env.example`, `.env.production`)
- [ ] Frontend uses environment variables for API calls
- [ ] Backend CORS configured for production origins

### ✅ Environment Variables Setup

#### Backend Required Variables:
- [ ] `GEMINI_API_KEY` - Your Google Gemini API key
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (Render default)
- [ ] `ALLOWED_ORIGINS` - Your frontend URL

#### Frontend Required Variables:
- [ ] `VITE_API_BASE_URL` - Your backend URL
- [ ] `VITE_APP_NAME=PrepTera`
- [ ] `VITE_ENABLE_VOICE_RECOGNITION=true`
- [ ] `VITE_NODE_ENV=production`

### ✅ Render Configuration
- [ ] `render.yaml` file created and configured
- [ ] GitHub repository connected to Render
- [ ] Blueprint deployed or services created manually

## Deployment Steps

### Method 1: Blueprint Deployment (Recommended)
1. [ ] Push code to GitHub
2. [ ] Go to Render Dashboard → New → Blueprint
3. [ ] Connect GitHub repository
4. [ ] Review and deploy services
5. [ ] Set `GEMINI_API_KEY` in backend environment variables
6. [ ] Update `ALLOWED_ORIGINS` with actual frontend URL
7. [ ] Update `VITE_API_BASE_URL` with actual backend URL

### Method 2: Manual Deployment
1. [ ] Deploy backend as Web Service
2. [ ] Deploy frontend as Static Site
3. [ ] Configure environment variables for both
4. [ ] Update CORS and API URLs

## Post-Deployment Verification

### ✅ Backend Testing
- [ ] Health check: `GET https://your-backend.onrender.com/`
- [ ] API endpoint: `GET https://your-backend.onrender.com/health`
- [ ] CORS working (no console errors in frontend)

### ✅ Frontend Testing
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Setup page navigation works
- [ ] Interview configuration works
- [ ] API calls successful (check Network tab)

### ✅ Full Interview Flow
- [ ] Interview starts successfully
- [ ] Questions are generated and displayed
- [ ] Voice recognition works (requires HTTPS)
- [ ] Answer submission works
- [ ] Report generation works
- [ ] Navigation between pages works

### ✅ Performance & Security
- [ ] HTTPS enabled on both services
- [ ] Environment variables properly set
- [ ] No sensitive data in client-side code
- [ ] CORS restricted to your domains only
- [ ] Error handling works properly

## Common Issues & Solutions

### 🔧 CORS Errors
- **Problem**: Frontend can't connect to backend
- **Solution**: Update `ALLOWED_ORIGINS` with exact frontend URL

### 🔧 API Connection Failed
- **Problem**: Frontend shows connection errors
- **Solution**: Verify `VITE_API_BASE_URL` points to correct backend

### 🔧 Voice Recognition Not Working
- **Problem**: Microphone doesn't work
- **Solution**: Ensure HTTPS is enabled (required for mic access)

### 🔧 Build Failures
- **Problem**: Services fail to build
- **Solution**: Check Node.js version (18+ required), verify package.json

### 🔧 Environment Variables Not Loading
- **Problem**: Features not working as expected
- **Solution**: Check variable names have correct prefixes (VITE_ for frontend)

## Monitoring & Maintenance

### 📊 Regular Checks
- [ ] Monitor service uptime
- [ ] Check error logs regularly
- [ ] Verify API key usage limits
- [ ] Monitor performance metrics

### 🔄 Updates
- [ ] Keep dependencies updated
- [ ] Rotate API keys periodically
- [ ] Monitor for security updates
- [ ] Backup configurations

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Google AI Studio**: https://aistudio.google.com/
- **PrepTera Repository**: https://github.com/yourusername/PrepTera
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Last Updated**: $(date)
**Version**: 1.0.0
