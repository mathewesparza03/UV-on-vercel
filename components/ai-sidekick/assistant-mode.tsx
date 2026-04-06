"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { MessageBubble } from "./message-bubble"
import { FileText, Send, Sparkles, List, MessageSquare, Clock, ImageIcon, X } from "lucide-react"

export function AssistantMode() {
  const [input, setInput] = useState("")
  const [contentToAnalyze, setContentToAnalyze] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/sidekick" }),
    id: "assistant-mode",
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setSelectedImage(result)
    }
    reader.readAsDataURL(file)
  }, [])

  const clearImage = useCallback(() => {
    setSelectedImage(null)
    if (imageInputRef.current) imageInputRef.current.value = ""
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    let messageText = ""
    
    if (selectedImage) {
      messageText = contentToAnalyze
        ? `[ASSISTANT_MODE] [IMAGE_ANALYSIS] Content context:\n---\n${contentToAnalyze}\n---\n\nUser request: ${input || "Please analyze this image and explain what you see."}`
        : `[ASSISTANT_MODE] [IMAGE_ANALYSIS] ${input || "Please analyze this image and explain what you see."}`
    } else {
      messageText = contentToAnalyze
        ? `[ASSISTANT_MODE] Content to analyze:\n---\n${contentToAnalyze}\n---\n\nUser question: ${input}`
        : `[ASSISTANT_MODE] ${input}`
    }

    // Build message parts
    const parts: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = []
    
    if (selectedImage) {
      parts.push({ type: "image", image: selectedImage })
    }
    parts.push({ type: "text", text: messageText })

    sendMessage({ parts })
    setInput("")
    clearImage()
  }

  const handleQuickAction = (action: string) => {
    if (!contentToAnalyze.trim() || isLoading) return

    const prompts: Record<string, string> = {
      summarize: `[ASSISTANT_MODE] Please provide a concise summary of this content:\n---\n${contentToAnalyze}\n---`,
      keypoints: `[ASSISTANT_MODE] Extract and list the key points from this content:\n---\n${contentToAnalyze}\n---`,
      questions: `[ASSISTANT_MODE] Generate thoughtful questions that this content answers or raises:\n---\n${contentToAnalyze}\n---`,
    }

    sendMessage({ text: prompts[action] })
  }

  const getMessageContent = (message: typeof messages[0]) => {
    return message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
  }

  return (
    <div className="flex flex-col h-full">
      {/* Content Input Section */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4 text-blue-500" />
          <span>Paste content or URL to analyze</span>
        </div>
        <textarea
          value={contentToAnalyze}
          onChange={(e) => setContentToAnalyze(e.target.value)}
          placeholder="Paste article text, webpage content, or a URL..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        {contentToAnalyze.trim() && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleQuickAction("summarize")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Summarize
            </button>
            <button
              onClick={() => handleQuickAction("keypoints")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <List className="w-3 h-3" />
              Key Points
            </button>
            <button
              onClick={() => handleQuickAction("questions")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              Questions
            </button>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Page Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Summarize articles, answer questions, and extract insights from any content.
              </p>
            </div>

            {/* Capabilities */}
            <div className="w-full space-y-2 mt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Smart Summaries</p>
                  <p className="text-xs text-muted-foreground">Get concise summaries of long articles and documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <List className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Key Point Extraction</p>
                  <p className="text-xs text-muted-foreground">Identify the most important information quickly</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Reading Estimates</p>
                  <p className="text-xs text-muted-foreground">Know how long content will take to read</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <ImageIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Image Analysis</p>
                  <p className="text-xs text-muted-foreground">Upload photos to get AI-powered answers and insights</p>
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
        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-20 rounded-lg border border-border object-contain"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
              disabled={isLoading}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImage ? "Ask about this image..." : "Ask about the content..."}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          
          {/* Image Upload Button */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all border",
              selectedImage
                ? "bg-blue-600/20 border-blue-500 text-blue-400"
                : "bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Upload image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
              (input.trim() || selectedImage) && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
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
