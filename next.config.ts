import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ev-database.org", pathname: "/img/**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ skip ESLint at build time
  },
  // (optional) while stabilizing CI only — remove later if you can
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
