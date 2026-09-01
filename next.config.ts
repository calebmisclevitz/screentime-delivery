import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits on top of the mobile bottom nav.
  devIndicators: false,
  // Figma Cloud deploys the standalone server bundle out of .next/standalone.
  output: "standalone",
};

export default nextConfig;
