import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set this to 5mb or 10mb depending on your product images
    },
  },
};

export default nextConfig;