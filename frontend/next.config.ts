import type { NextConfig } from "next";
import { backendOrigin } from "../scripts/dev-config.json";

const configuredOrigin = process.env.COOKIEGUARD_BACKEND_ORIGIN ?? backendOrigin;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COOKIEGUARD_BACKEND_ORIGIN: configuredOrigin,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
