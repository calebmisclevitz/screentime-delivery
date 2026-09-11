import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without these, dev chunks and the HMR socket are blocked when a phone on the
  // LAN loads the dev server by IP, so the page renders but never hydrates.
  allowedDevOrigins: [
    "10.*.*.*", 
    "192.168.*.*", 
    "172.*.*.*", 
    "*.local",
    '*.figdev.systems', // Coder devbox proxy
    // makeproxy preview proxies (4-label hosts)
    '*.makeproxy-c.figma.site', // production
    '*.makeproxy-m.figma.site', // production
    '*.makeproxy-c.pung.site', // staging
    '*.makeproxy-m.pung.site', // staging
    '*.makeproxy-c.pung-sandbox.site', // devenv01
    '*.makeproxy-m.pung-sandbox.site', // devenv01
    '*.makeproxy-c.pung-devbox.site', // devbox
    '*.makeproxy-m.pung-devbox.site', // devbox
    '*.makeproxy-c.figma-gov.site', // gov
    '*.makeproxy-m.figma-gov.site', // gov
    // figmaiframepreview wrapper origin (3-label host)
    '*.figma.site', // production
    '*.pung.site', // staging
    '*.pung-sandbox.site', // devenv01
    '*.pung-devbox.site', // devbox
    '*.figma-gov.site', // gov
  ],
  async redirects() {
    return [{ source: "/browse", destination: "/", permanent: false }];
  },
  // The floating dev badge sits on top of the mobile bottom nav.
  devIndicators: false,
  // Figma Cloud deploys the standalone server bundle out of .next/standalone.
  output: "standalone",
};

export default nextConfig;
