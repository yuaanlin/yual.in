const withBundleAnalyzer =
  require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { isrMemoryCacheSize: 0, },
  images: {
    domains: [
      'images.unsplash.com',
      'i.imgur.com',
      'image.api.playstation.com',
      'kinsta.com',
      'miro.medium.com'
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
