/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable dynamic rendering for new blog posts
  async headers() {
    return [
      {
        // Never cache HTML pages so browsers always fetch fresh chunk references
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  images: {
    unoptimized: true,
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
}

export default nextConfig