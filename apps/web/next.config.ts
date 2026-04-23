import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  typescript: {
    // TODO: Remove this after fixing
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
