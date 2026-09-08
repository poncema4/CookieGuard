import type { NextConfig } from "next";
import { backendOrigin } from "../scripts/dev-config.json";

const configuredOrigin = process.env.COOKIEGUARD_BACKEND_ORIGIN ?? backendOrigin;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COOKIEGUARD_BACKEND_ORIGIN: configuredOrigin,
  },
};

export default nextConfig;
