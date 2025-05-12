const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // only when you want analyze
});

const nextConfig = {
  images: {
    domains: ['media-stream.b-cdn.net'],
    unoptimized: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
