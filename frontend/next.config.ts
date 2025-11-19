import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/quiz-lab',
  assetPrefix: '/quiz-lab',
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/quiz-lab', 
        permanent: false,
      },
    ];
  },
};

export default nextConfig;