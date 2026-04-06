"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type SidekickMode = "security" | "assistant" | "tutor"

interface SidekickContextType {
  isOpen: boolean
  mode: SidekickMode
  openSidekick: () => void
  closeSidekick: () => void
  toggleSidekick: () => void
  setMode: (mode: SidekickMode) => void
}

const SidekickContext = createContext<SidekickContextType | undefined>(undefined)

export function SidekickProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<SidekickMode>("assistant")

  const openSidekick = useCallback(() => setIsOpen(true), [])
  const closeSidekick = useCallback(() => setIsOpen(false), [])
  const toggleSidekick = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <SidekickContext.Provider
      value={{
        isOpen,
        mode,
        openSidekick,
        closeSidekick,
        toggleSidekick,
        setMode,
      }}
    >
      {children}
    </SidekickContext.Provider>
  )
}

export function useSidekick() {
  const context = useContext(SidekickContext)
  if (context === undefined) {
    throw new Error("useSidekick must be used within a SidekickProvider")
  }
  return context
}
