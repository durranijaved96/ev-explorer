import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ev-database.org", pathname: "/img/**" },
    ],
  },
};

export default nextConfig;
