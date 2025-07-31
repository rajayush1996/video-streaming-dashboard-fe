
// config/config.js

const config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ,
    appName: 'vsd',
    version: '1.0.0',
    // Add more centralized config here
    endpoints: {
      login: '/api/v1/admin/auth/sign-in',
      signUp: '/api/v1/admin/auth/signup',
      verifyEmail: '/api/v1/admin/auth/verify-email',
      upload: '/api/v1/admin/videos/upload',
      uploadProgress: '/api/v1/admin/videos/progress',
      metadata: '/api/v1/admin/media-metadata',
      mediaMetadata: '/api/v1/admin/media-metadata',
      resendEmail: '/api/v1/admin/auth/resend-verification',
      refreshToken: '/api/v1/admin/auth/refresh-token',
      blog: '/api/v1/admin/blogs',
      userProfile: '/api/v1/admin/users/me',
      dashboard: '/api/v1/admin/dashboard',
      users: '/api/v1/admin/users',
      adminUsers: '/api/v1/admin/users',
      reels: '/api/v1/admin/reels',
      reelsUpload: '/api/v1/admin/reels/upload',
      categories: '/api/v1/admin/categories',
      categoryType: '/api/v1/admin/categories/type',
      uploadImage: '/api/v1/admin/upload/image',
      uploadInitiate: '/api/v1/admin/upload/initiate',
      uploadStatus: '/api/v1/admin/upload/status',
      uploadChunk: '/api/v1/admin/upload/chunk',
      uploadComplete: '/api/v1/admin/upload/complete',
      creator: '/api/v1/creator-requests',
      adminCreator: '/api/v1/admin/creator-requests',
      notifications: '/api/v1/admin/notifications',
      moderation: '/api/v1/admin/dashboard/moderation'
    },
  };
  
  export default config;
  