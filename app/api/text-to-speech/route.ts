import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // ElevenLabs API configuration
    const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM" // Default voice ID

    if (!elevenlabsApiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    // Call ElevenLabs API to convert text to speech
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": elevenlabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs API error: ${errorText}`)
    }

    // Return the audio as a stream
    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    return NextResponse.json({ error: "Failed to convert text to speech" }, { status: 500 })
  }
}
