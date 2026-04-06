"use client"

import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  isLoading?: boolean
}

export function MessageBubble({ role, content, imageUrl, isLoading }: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary/20 text-primary"
            : "bg-accent/20 text-accent"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded content"
            className="max-w-full rounded-lg border border-border max-h-48 object-contain"
          />
        )}

        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border rounded-tl-sm"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
            </div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
