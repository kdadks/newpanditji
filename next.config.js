/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Configure Turbopack instead of webpack
  turbopack: {
    rules: {
      // Add any custom rules if needed
    },
  },
}

module.exports = nextConfig