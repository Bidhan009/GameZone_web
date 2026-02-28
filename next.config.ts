import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow loading images from the API server running on localhost:5000 (and other hosts if needed)
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set this to 5mb or 10mb depending on your product images
    },
  },
};

export default nextConfig;