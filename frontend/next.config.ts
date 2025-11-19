import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  
  async redirects() {
    return [
      {
        source: '/quiz-lab',
        destination: '/quiz-lab', 
        permanent: false,
      },
    ];
  },
};

export default nextConfig;