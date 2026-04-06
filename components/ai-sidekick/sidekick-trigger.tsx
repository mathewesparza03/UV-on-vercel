"use client"

import { cn } from "@/lib/utils"
import { useSidekick } from "./sidekick-context"
import { Bot, X } from "lucide-react"

export function SidekickTrigger() {
  const { isOpen, toggleSidekick } = useSidekick()

  return (
    <button
      onClick={toggleSidekick}
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "w-14 h-14 rounded-full",
        "flex items-center justify-center",
        "bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/25",
        "hover:scale-105 active:scale-95",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      )}
      aria-label={isOpen ? "Close AI Sidekick" : "Open AI Sidekick"}
      aria-expanded={isOpen}
    >
      <div className={cn(
        "transition-transform duration-300",
        isOpen ? "rotate-90" : "rotate-0"
      )}>
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </div>
      
      {/* Pulse animation when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      )}
    </button>
  )
}
