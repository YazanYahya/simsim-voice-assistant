import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Prepare conversation history for context
    const conversationHistory = history
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    // Generate response using OpenAI
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      system: `You are Simsim, a helpful customer service AI assistant for small businesses. 
      You provide concise, friendly, and helpful responses to customer inquiries.
      Focus on solving common customer service issues like account access, billing questions, 
      product information, and technical support.
      Keep responses brief and conversational, as they will be spoken aloud.
      If the user asks about sending an invoice, scheduling a meeting, or other actionable tasks,
      indicate that you can perform these actions.`,
      prompt: `${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ""}User: ${message}\n\nAssistant:`,
    })

    // Check if the response contains an action trigger
    let action = null
    if (message.toLowerCase().includes("invoice") && message.toLowerCase().includes("send")) {
      action = {
        type: "email",
        data: {
          recipient: "client@example.com",
          subject: "Invoice #1234",
          body: "Please find attached invoice #1234 for your recent order.",
        },
      }
    }

    return NextResponse.json({ response: text, action })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
