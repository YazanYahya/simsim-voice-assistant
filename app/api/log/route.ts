import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for logs (would be replaced with a database in production)
const conversationLogs: any[] = []
const questionFrequency: Record<string, number> = {}

export async function POST(request: NextRequest) {
  try {
    const { userMessage, assistantResponse, timestamp } = await request.json()

    // Store the conversation log
    const logEntry = {
      id: Date.now().toString(),
      userMessage,
      assistantResponse,
      timestamp: timestamp || new Date().toISOString(),
    }

    conversationLogs.push(logEntry)

    // Update question frequency for analytics
    // Simple implementation - in production, you'd use NLP to categorize questions
    const normalizedQuestion = userMessage.toLowerCase().trim()
    questionFrequency[normalizedQuestion] = (questionFrequency[normalizedQuestion] || 0) + 1

    return NextResponse.json({
      success: true,
      timestamp: logEntry.timestamp,
    })
  } catch (error) {
    console.error("Error logging interaction:", error)
    return NextResponse.json({ error: "Failed to log interaction" }, { status: 500 })
  }
}

// GET endpoint to retrieve logs for the admin dashboard
export async function GET() {
  try {
    // Get the most frequent questions
    const sortedQuestions = Object.entries(questionFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }))

    // Get recent conversations
    const recentLogs = conversationLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 100)

    // Calculate total conversations
    const totalConversations = conversationLogs.length

    // Calculate conversations per day (last 7 days)
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const conversationsPerDay = Array(7)
      .fill(0)
      .map((_, index) => {
        const date = new Date(now.getTime() - index * 24 * 60 * 60 * 1000)
        const dateString = date.toISOString().split("T")[0]

        const count = conversationLogs.filter((log) => {
          const logDate = new Date(log.timestamp).toISOString().split("T")[0]
          return logDate === dateString
        }).length

        return {
          date: dateString,
          count,
        }
      })
      .reverse()

    return NextResponse.json({
      totalConversations,
      conversationsPerDay,
      frequentQuestions: sortedQuestions,
      recentLogs,
    })
  } catch (error) {
    console.error("Error retrieving logs:", error)
    return NextResponse.json({ error: "Failed to retrieve logs" }, { status: 500 })
  }
}
