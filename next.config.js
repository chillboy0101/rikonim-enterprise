/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'rikonim.com'
          }
        ],
        destination: 'https://www.rikonim.com/:path*',
        permanent: true
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html'
      },
      {
        source: '/admin/',
        destination: '/admin/index.html'
      }
    ];
  }
};

module.exports = nextConfig;
