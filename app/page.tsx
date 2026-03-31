"use client";

import { useCallback } from "react";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { QuickLinks } from "@/components/quick-links";

export default function Home() {
  const handleSearch = useCallback((query: string) => {
    // Check if it's a URL
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    const isUrl = urlPattern.test(query);

    if (isUrl) {
      // If it doesn't start with http/https, add https://
      const url = query.startsWith("http") ? query : `https://${query}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Search using DuckDuckGo
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleQuickLink = useCallback((url: string) => {
    if (url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Subtle background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between relative z-10">
        <Logo />
        <nav className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-2xl flex flex-col items-center gap-10">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              <span className="text-foreground">Browse </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Freely
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto text-pretty">
              Fast, secure, and private web access at your fingertips
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Quick Links */}
          <div className="w-full space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground text-center">
              Quick Access
            </h2>
            <QuickLinks onLinkClick={handleQuickLink} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center relative z-10">
        <p className="text-xs text-muted-foreground">
          Secure and private browsing.{" "}
          <a href="#" className="text-primary hover:underline">
            Learn more
          </a>
        </p>
      </footer>
    </main>
  );
}
