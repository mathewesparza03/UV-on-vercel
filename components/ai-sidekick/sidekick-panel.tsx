"use client"

import { useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useSidekick, type SidekickMode } from "./sidekick-context"
import { SecurityMode } from "./security-mode"
import { AssistantMode } from "./assistant-mode"
import { TutorMode } from "./tutor-mode"
import { X, Shield, FileText, GraduationCap } from "lucide-react"

const modes: { id: SidekickMode; label: string; icon: typeof Shield }[] = [
  { id: "security", label: "Security", icon: Shield },
  { id: "assistant", label: "Assistant", icon: FileText },
  { id: "tutor", label: "Tutor", icon: GraduationCap },
]

export function SidekickPanel() {
  const { isOpen, closeSidekick, mode, setMode } = useSidekick()

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSidekick()
      }
    },
    [isOpen, closeSidekick]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidekick}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border z-50",
          "flex flex-col shadow-2xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="AI Sidekick"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold">AI Sidekick</h2>
          <button
            onClick={closeSidekick}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close sidekick"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Mode Tabs */}
        <nav className="flex border-b border-border" role="tablist">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              role="tab"
              aria-selected={mode === id}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                mode === id
                  ? "text-foreground border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "w-4 h-4",
                mode === id && id === "security" && "text-emerald-500",
                mode === id && id === "assistant" && "text-blue-500",
                mode === id && id === "tutor" && "text-violet-500"
              )} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {mode === "security" && <SecurityMode />}
          {mode === "assistant" && <AssistantMode />}
          {mode === "tutor" && <TutorMode />}
        </div>
      </aside>
    </>
  )
}
