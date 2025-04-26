
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
      metadata: '/api/v1/videos/metadata',
      mediaMetadata: '/api/v1/media-metadata',
      resendEmail: '/api/v1/auth/resend-verification',
      refreshToken: '/api/v1/auth/refresh-token',
      blog: '/api/v1/blogs',
      userProfile: '/api/v1/user/me',
      dashboard: '/api/v1/dashboard',
      users: '/api/v1/users',
      adminUsers: '/api/v1/admin/users',
      reels: '/api/v1/reels',
      reelsUpload: '/api/v1/reels/upload',
    },
  };
  
  export default config;
  