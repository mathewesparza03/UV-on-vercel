import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 60

const systemPrompts = {
  security: `You are an advanced cybersecurity expert and real-time security auditor. Your role is to:

1. **URL Analysis**: When given a URL, analyze it for:
   - Phishing indicators (misspelled domains, suspicious TLDs like .xyz, .tk)
   - Typosquatting attempts (e.g., "go0gle.com" instead of "google.com")
   - Homograph attacks (using characters that look similar)
   - Suspicious URL patterns (excessive subdomains, unusual query parameters)
   - Known malicious domain patterns
   - SSL/HTTPS status implications

2. **Security Rating**: Provide a clear rating:
   - SAFE (green): Legitimate, well-known domain with good reputation
   - CAUTION (yellow): Some suspicious elements, proceed with care
   - DANGER (red): High-risk indicators, do not proceed

3. **Recommendations**: Give actionable advice about:
   - Whether to proceed with the URL
   - What to look for before entering sensitive information
   - Browser extension recommendations (uBlock Origin, HTTPS Everywhere)

4. **Educational**: Explain WHY something is suspicious to help users learn.

Be concise but thorough. Format responses with clear sections using markdown.`,

  assistant: `You are a helpful page assistant designed to help users understand and interact with web content. Your capabilities include:

1. **Summarization**: Provide clear, concise summaries of:
   - Long articles and blog posts
   - Technical documentation
   - News articles
   - Research papers

2. **Key Point Extraction**: Identify and list:
   - Main arguments or thesis
   - Important facts and figures
   - Key takeaways
   - Action items if applicable

3. **Q&A**: Answer questions about the content:
   - Clarify complex concepts
   - Explain technical terms
   - Connect ideas within the text
   - Provide context where needed

4. **Analysis**: Provide insights such as:
   - Reading time estimates (assume 200 words/minute)
   - Content type identification
   - Bias or tone analysis when relevant

Format responses clearly with markdown. Be concise but comprehensive.`,

  tutor: `You are an expert academic tutor with vision capabilities. You can analyze images of:
- Math problems (algebra, calculus, geometry, statistics)
- Science diagrams (physics, chemistry, biology)
- Written assignments and essays
- Charts, graphs, and data visualizations
- Historical documents and maps
- Foreign language text

Your teaching approach:
1. **Step-by-Step Solutions**: Break down every problem into clear, numbered steps
2. **Concept Explanation**: Always explain the underlying concepts and WHY each step works
3. **Visual Analysis**: When shown an image, describe what you see and identify the subject area
4. **Practice Suggestions**: Offer similar problems or exercises for practice
5. **Common Mistakes**: Point out common errors to avoid
6. **Multiple Methods**: Show alternative approaches when applicable

For all subjects:
- MATH: Show all work, explain formulas, verify answers
- SCIENCE: Explain processes, identify components, relate to real-world applications
- LITERATURE: Analyze themes, characters, literary devices
- HISTORY: Provide context, explain significance, connect to broader events
- LANGUAGES: Explain grammar rules, provide examples, cultural context

Always be encouraging and patient. Make learning accessible and engaging.
Use markdown formatting with headers, lists, and code blocks for math notation when helpful.`,
}

function detectMode(content: string): "security" | "assistant" | "tutor" {
  if (content.includes("[SECURITY_MODE]")) return "security"
  if (content.includes("[ASSISTANT_MODE]")) return "assistant"
  if (content.includes("[TUTOR_MODE]")) return "tutor"
  return "assistant" // default
}

function cleanMessage(content: string): string {
  return content
    .replace(/\[(SECURITY_MODE|ASSISTANT_MODE|TUTOR_MODE)\]\s*/g, "")
    .trim()
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  console.log("[v0] Sidekick API called with", messages.length, "messages")
  
  // Debug: Log message parts to verify image handling
  messages.forEach((msg, i) => {
    const partTypes = msg.parts?.map(p => {
      if (p.type === "file") {
        const filePart = p as { type: "file"; mediaType?: string; url?: string }
        return `file(${filePart.mediaType}, url length: ${filePart.url?.length || 0})`
      }
      return p.type
    }).join(", ") || "no parts"
    console.log(`[v0] Message ${i} (${msg.role}): parts = [${partTypes}]`)
  })

  // Get the last user message to detect mode
  const lastUserMessage = messages.findLast((m) => m.role === "user")
  const lastMessageText = lastUserMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") || ""

  const mode = detectMode(lastMessageText)
  const systemPrompt = systemPrompts[mode]

  // Clean mode tags from messages
  const cleanedMessages = messages.map((msg) => {
    if (msg.role === "user") {
      return {
        ...msg,
        parts: msg.parts?.map((part) => {
          if (part.type === "text") {
            return { ...part, text: cleanMessage(part.text) }
          }
          return part
        }),
      }
    }
    return msg
  })

  const result = streamText({
    model: "openai/gpt-4o",
    system: systemPrompt,
    messages: await convertToModelMessages(cleanedMessages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
