import { type NextRequest, NextResponse } from "next/server"
import { saveTranscript } from "@/lib/transcript-storage"  // 👈 Import DB helper
import { getCurrentUser } from "@/lib/simple-auth"        // 👈 To associate transcript with user

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        error: "Missing Hugging Face API key. Add HUGGINGFACE_API_KEY to .env.local"
      }, { status: 500 })
    }

    // Convert File -> Buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())

    // Call Hugging Face Whisper ASR
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "audio/wav"
        },
        body: audioBuffer
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: "ASR request failed", details: errorText }, { status: 500 })
    }

    const result = await response.json()
    const transcript = result?.text || "No transcription result."

    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Save transcript to DB
    await saveTranscript(user.id, transcript)

    return NextResponse.json({ transcript })
  } catch (error: any) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}
