import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to reduce deployment size
  output: 'standalone',
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ev-database.org", pathname: "/img/**" },
    ],
    // Optimize images
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Optimize compiler output
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Disable source maps in production to reduce size
  productionBrowserSourceMaps: false,
  
  // Optimize bundle
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;