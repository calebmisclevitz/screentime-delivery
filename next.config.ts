import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without these, dev chunks and the HMR socket are blocked when a phone on the
  // LAN loads the dev server by IP, so the page renders but never hydrates.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*", "*.local"],
  async redirects() {
    return [{ source: "/browse", destination: "/", permanent: false }];
  },
  // The floating dev badge sits on top of the mobile bottom nav.
  devIndicators: false,
  // Figma Cloud deploys the standalone server bundle out of .next/standalone.
  output: "standalone",
};

export default nextConfig;
