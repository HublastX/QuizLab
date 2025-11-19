import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/quiz-lab',
  assetPrefix: '/quiz-lab',
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',  // automaticamente vira /quiz-lab/home
        permanent: false,
      },
    ];
  },
};

export default nextConfig;