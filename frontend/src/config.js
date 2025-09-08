// Configuration for PrepTera Frontend
const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'PrepTera',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENABLE_VOICE_RECOGNITION: import.meta.env.VITE_ENABLE_VOICE_RECOGNITION === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development'
};

export default config;
