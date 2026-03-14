import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: '10mb',
  },
} as any;
export default nextConfig;
