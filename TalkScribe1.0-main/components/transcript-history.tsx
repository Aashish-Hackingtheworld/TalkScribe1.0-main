"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Trash2, Calendar, Clock } from "lucide-react"
import { transcriptService, type Transcript } from "@/lib/transcript-storage"
import type { User } from "@/lib/auth"

interface TranscriptHistoryProps {
  user: User
  onBack: () => void
}

export default function TranscriptHistory({ user, onBack }: TranscriptHistoryProps) {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null)

  useEffect(() => {
    fetchTranscripts()
  }, [])

  const fetchTranscripts = () => {
    try {
      const userTranscripts = transcriptService.getTranscripts(user.id)
      setTranscripts(userTranscripts)
    } catch (error) {
      console.error("Error fetching transcripts:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTranscript = (id: string) => {
    try {
      transcriptService.deleteTranscript(id)
      setTranscripts(transcripts.filter((t) => t.id !== id))
      if (selectedTranscript?.id === id) {
        setSelectedTranscript(null)
      }
    } catch (error) {
      console.error("Error deleting transcript:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTranscripts = transcripts.filter(
    (transcript) =>
      transcript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transcript.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedTranscript) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSelectedTranscript(null)}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 font-sans">{selectedTranscript.title}</h1>
              <p className="text-slate-600 font-sans">{formatDate(selectedTranscript.created_at)}</p>
            </div>
          </div>

          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 font-sans flex items-center justify-between">
                Transcript Details
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(selectedTranscript.audio_duration)}
                  </div>
                  <Button
                    onClick={() => deleteTranscript(selectedTranscript.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-lg border">
                <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedTranscript.content}
                </p>
              </div>
              {selectedTranscript.translatedContent && (
                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700 mb-2 font-sans">Translation:</h4>
                  <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                    <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedTranscript.translatedContent}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-sans">Transcript History</h1>
            <p className="text-slate-600 font-sans">View and manage your saved transcriptions</p>
          </div>
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Recording
          </Button>
        </div>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search transcripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-300"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredTranscripts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 font-sans">
                  {searchQuery
                    ? "No transcripts match your search."
                    : "No transcripts yet. Start recording to create your first transcript!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTranscripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTranscript(transcript)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 font-sans mb-1">{transcript.title}</h3>
                        <p className="text-slate-600 text-sm font-sans line-clamp-2 mb-2">
                          {transcript.content.substring(0, 150)}
                          {transcript.content.length > 150 ? "..." : ""}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(transcript.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(transcript.audio_duration)}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTranscript(transcript.id)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
