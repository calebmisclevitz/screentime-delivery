import type { Metadata, Viewport } from "next";
import {
  DM_Mono,
  Special_Gothic,
  Special_Gothic_Condensed_One,
} from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";

import "leaflet/dist/leaflet.css";
import "./globals.css";

const specialGothic = Special_Gothic({
  variable: "--font-special",
  subsets: ["latin"],
  weight: ["400", "500"],
  adjustFontFallback: false,
});

const specialGothicCondensed = Special_Gothic_Condensed_One({
  variable: "--font-special-condensed",
  subsets: ["latin"],
  weight: "400",
  adjustFontFallback: false,
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Yardsale — Raleigh",
  description:
    "Buy and sell secondhand nearby. Choose delivery and a neighbor brings it to you.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#deedf2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${specialGothic.variable} ${specialGothicCondensed.variable} ${dmMono.variable} antialiased`}
    >
      <body className="relative flex h-dvh flex-col overflow-hidden bg-background text-foreground">
        <AppShell>{children}</AppShell>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
