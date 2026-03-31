"use client";

import { useState, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch?.(query.trim());
      }
    },
    [query, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && query.trim()) {
        onSearch?.(query.trim());
      }
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-2xl", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-full transition-all duration-300",
          "bg-card border border-border",
          isFocused && "border-primary/50 shadow-neon-purple"
        )}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter a URL"
          className={cn(
            "w-full bg-transparent px-6 py-4 text-base md:text-lg text-foreground",
            "placeholder:text-muted-foreground outline-none rounded-full",
            "transition-all duration-200"
          )}
          aria-label="Search or enter a URL"
        />
        <button
          type="submit"
          className={cn(
            "absolute right-2 p-3 rounded-full",
            "bg-primary/10 hover:bg-primary/20 text-primary",
            "transition-all duration-200 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          aria-label="Search"
        >
          {query.trim() ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}
