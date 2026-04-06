"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { MessageBubble } from "./message-bubble"
import { Shield, Send, AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react"

export function SecurityMode() {
  const [input, setInput] = useState("")
  const [urlToAnalyze, setUrlToAnalyze] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/sidekick" }),
    id: "security-mode",
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = urlToAnalyze
      ? `[SECURITY_MODE] Analyze this URL for security risks: ${urlToAnalyze}\n\nUser question: ${input}`
      : `[SECURITY_MODE] ${input}`

    sendMessage({ text: message })
    setInput("")
  }

  const handleQuickAnalyze = () => {
    if (!urlToAnalyze.trim() || isLoading) return
    sendMessage({
      text: `[SECURITY_MODE] Perform a comprehensive security analysis of this URL: ${urlToAnalyze}. Check for phishing indicators, suspicious patterns, SSL concerns, and provide a safety rating.`,
    })
  }

  const getMessageContent = (message: typeof messages[0]) => {
    return message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
  }

  return (
    <div className="flex flex-col h-full">
      {/* URL Input Section */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Enter a URL to analyze for security risks</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={urlToAnalyze}
            onChange={(e) => setUrlToAnalyze(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleQuickAnalyze}
            disabled={!urlToAnalyze.trim() || isLoading}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Security Auditor</h3>
              <p className="text-sm text-muted-foreground">
                Analyze URLs for phishing risks, malicious trackers, and security concerns.
              </p>
            </div>

            {/* Quick Tips */}
            <div className="w-full space-y-2 mt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phishing Detection</p>
                  <p className="text-xs text-muted-foreground">Identifies suspicious domain patterns and typosquatting</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">SSL Analysis</p>
                  <p className="text-xs text-muted-foreground">Checks for secure connections and certificate issues</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Browser Extension</p>
                  <p className="text-xs text-muted-foreground">
                    For real-time protection, consider using extensions like{" "}
                    <a href="https://www.ublock.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      uBlock Origin <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageContent(message)}
            />
          ))
        )}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <MessageBubble role="assistant" content="" isLoading />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about security concerns..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
              input.trim() && !isLoading
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
