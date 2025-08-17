export interface Transcript {
  id: string
  title: string
  content: string
  translatedContent?: string
  audio_duration: number
  created_at: string
  user_id: string
}

export const transcriptService = {
  saveTranscript: (transcript: Omit<Transcript, "id" | "created_at">): Transcript => {
    const transcripts = JSON.parse(localStorage.getItem("transcripts") || "[]")
    const newTranscript: Transcript = {
      ...transcript,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    transcripts.push(newTranscript)
    localStorage.setItem("transcripts", JSON.stringify(transcripts))
    return newTranscript
  },

  getTranscripts: (userId: string): Transcript[] => {
    const transcripts = JSON.parse(localStorage.getItem("transcripts") || "[]")
    return transcripts.filter((t: Transcript) => t.user_id === userId)
  },

  deleteTranscript: (id: string): void => {
    const transcripts = JSON.parse(localStorage.getItem("transcripts") || "[]")
    const filtered = transcripts.filter((t: Transcript) => t.id !== id)
    localStorage.setItem("transcripts", JSON.stringify(filtered))
  },

  updateTranscript: (id: string, updates: Partial<Transcript>): void => {
    const transcripts = JSON.parse(localStorage.getItem("transcripts") || "[]")
    const index = transcripts.findIndex((t: Transcript) => t.id === id)
    if (index !== -1) {
      transcripts[index] = { ...transcripts[index], ...updates }
      localStorage.setItem("transcripts", JSON.stringify(transcripts))
    }
  },
}
