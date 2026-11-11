import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Keep browser source maps out of production output unless explicitly required.
  productionBrowserSourceMaps: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
