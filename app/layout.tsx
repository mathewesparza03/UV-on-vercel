import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidekickProvider } from "@/components/ai-sidekick/sidekick-context";
import { SidekickPanel } from "@/components/ai-sidekick/sidekick-panel";
import { SidekickTrigger } from "@/components/ai-sidekick/sidekick-trigger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proxy | Fast & Secure Web Access with AI Sidekick",
  description:
    "A modern, fast, and secure web proxy service. Browse the web freely and privately.",
  keywords: ["proxy", "web proxy", "secure browsing", "privacy"],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SidekickProvider>
          {children}
          <SidekickTrigger />
          <SidekickPanel />
        </SidekickProvider>
      </body>
    </html>
  );
}
