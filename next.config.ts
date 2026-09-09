import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/browse", destination: "/", permanent: false }];
  },
  // The floating dev badge sits on top of the mobile bottom nav.
  devIndicators: false,
  // Figma Cloud deploys the standalone server bundle out of .next/standalone.
  output: "standalone",
};

export default nextConfig;
