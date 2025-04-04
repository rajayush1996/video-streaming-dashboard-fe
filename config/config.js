// config/config.js
const config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ,
    appName: 'vsd',
    version: '1.0.0',
    // Add more centralized config here
    endpoints: {
      login: '/api/v1/auth/sign-in',
      signUp: '/api/v1/auth/sign-up',
      verifyEmail: '/api/v1/auth/verify-email',
      upload: '/api/v1/videos/upload',
      uploadProgress: '/api/v1/videos/progress',
      metadata: '/api/v1/videos/metadata'
    },
  };
  
  export default config;
  