import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://localhost:4443/api/:path*",
      },
    ];
  },
};

export default nextConfig;
