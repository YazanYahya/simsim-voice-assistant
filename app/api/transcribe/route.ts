import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Create a buffer from the audio file
    const buffer = Buffer.from(await audioFile.arrayBuffer())

    // Prepare the request to Deepgram
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY

    if (!deepgramApiKey) {
      return NextResponse.json({ error: "Deepgram API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.deepgram.com/v1/listen", {
      method: "POST",
      headers: {
        Authorization: `Token ${deepgramApiKey}`,
        "Content-Type": "audio/wav",
      },
      body: buffer,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Deepgram API error: ${errorText}`)
    }

    const data = await response.json()

    // Extract the transcription
    const text = data.results?.channels[0]?.alternatives[0]?.transcript || ""

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in transcription:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
