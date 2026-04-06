"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { MessageBubble } from "./message-bubble"
import { ImageUpload } from "./image-upload"
import { GraduationCap, Send, Calculator, FlaskConical, BookOpen, Globe, Languages } from "lucide-react"

export function TutorMode() {
  const [input, setInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/sidekick" }),
    id: "tutor-mode",
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
    if ((!input.trim() && !selectedImage) || isLoading) return

    const textContent = input.trim() || "Please analyze this image and provide a detailed explanation with step-by-step solutions if applicable."

    if (selectedImage) {
      // Send multimodal message with image
      sendMessage({
        text: `[TUTOR_MODE] ${textContent}`,
        experimental_attachments: [
          {
            contentType: "image/jpeg",
            url: selectedImage,
          },
        ],
      })
    } else {
      sendMessage({ text: `[TUTOR_MODE] ${textContent}` })
    }

    setInput("")
    setSelectedImage(null)
  }

  const getMessageContent = (message: typeof messages[0]) => {
    return message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
  }

  const getMessageImage = (message: typeof messages[0]) => {
    const imagePart = message.parts?.find(
      (p): p is { type: "file"; mediaType: string; url: string } =>
        p.type === "file" && p.mediaType?.startsWith("image/")
    )
    return imagePart?.url
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Academic Tutor</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos of problems or ask questions. I provide step-by-step explanations.
              </p>
            </div>

            {/* Subjects */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <Calculator className="w-4 h-4 text-violet-500" />
                <span className="text-sm">Math</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <FlaskConical className="w-4 h-4 text-violet-500" />
                <span className="text-sm">Science</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <BookOpen className="w-4 h-4 text-violet-500" />
                <span className="text-sm">Literature</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <Globe className="w-4 h-4 text-violet-500" />
                <span className="text-sm">History</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border col-span-2">
                <Languages className="w-4 h-4 text-violet-500" />
                <span className="text-sm">Languages & More</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Tip: Upload a photo of your homework for instant help!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageContent(message)}
              imageUrl={getMessageImage(message)}
            />
          ))
        )}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <MessageBubble role="assistant" content="" isLoading />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Image Upload */}
        <ImageUpload
          onImageSelect={setSelectedImage}
          selectedImage={selectedImage}
          disabled={isLoading}
        />

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImage ? "Describe what you need help with..." : "Ask any academic question..."}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
              (input.trim() || selectedImage) && !isLoading
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
