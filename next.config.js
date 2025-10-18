/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    deviceSizes: [360, 640, 768, 1024, 1280, 1440],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
