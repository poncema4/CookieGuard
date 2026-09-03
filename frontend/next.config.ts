import type { NextConfig } from "next";
import { BACKEND_ORIGIN } from "../scripts/dev-config.mjs";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COOKIEGUARD_BACKEND_ORIGIN: BACKEND_ORIGIN,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
