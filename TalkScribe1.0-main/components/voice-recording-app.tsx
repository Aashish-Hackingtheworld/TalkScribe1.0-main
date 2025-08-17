"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Square, Play, Pause, LogOut, History, Languages, Zap, Clock } from "lucide-react"
import { authService, type User } from "@/lib/auth"
import { transcriptService } from "@/lib/transcript-storage"
import { useRouter } from "next/navigation"
import TranscriptHistory from "./transcript-history"

interface VoiceRecordingAppProps {
  user: User
}

interface Transcript {
  id: string
  title: string
  content: string
  translatedContent?: string
  audio_duration: number
  created_at: string
  user_id: string
}

type TranscriptionMode = "live" | "traditional"

export default function VoiceRecordingApp({ user }: VoiceRecordingAppProps) {
  const router = useRouter()
  const [showHistory, setShowHistory] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [speechSupported, setSpeechSupported] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [transcriptionMode, setTranscriptionMode] = useState<TranscriptionMode>("live")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      console.log("Web Speech API supported, initializing...")
      setSpeechSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        console.log("Speech recognition result received")
        let interim = ""
        let final = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript + " "
            console.log("Final transcript:", transcript)
          } else {
            interim += transcript
            console.log("Interim transcript:", transcript)
          }
        }

        setInterimTranscript(interim)
        if (final) {
          setFinalTranscript((prev) => prev + final)
        }
      }

      recognition.onerror = (event: any) => {
        console.log("Speech recognition error:", event.error)
        console.log("Error details:", event)
        setIsListening(false)

        if (event.error === "not-allowed") {
          console.log("Microphone permission denied")
          setIsRecording(false)
          alert("Microphone access denied. Please allow microphone access in your browser settings and try again.")
        } else if (event.error === "no-speech") {
          console.log("No speech detected, but continuing to listen...")
        } else {
          console.log("Speech recognition error, stopping recording")
          setIsRecording(false)
        }
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)
      }

      recognitionRef.current = recognition
      console.log("Speech recognition initialized successfully")
    } else {
      console.log("Web Speech API not supported in this browser")
      setSpeechSupported(false)
    }
  }, [])

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      console.log(`Starting recording in ${transcriptionMode} mode...`)

      if (recognitionRef.current && isListening) {
        console.log("Stopping existing speech recognition...")
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.log("Error stopping existing recognition:", error)
        }
        setIsListening(false)
        // Wait for recognition to fully stop
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      if (transcriptionMode === "live") {
        console.log("Initializing live transcription mode...")
        setIsRecording(true)
        setRecordingTime(0)
        setTranscript("")
        setFinalTranscript("")
        setInterimTranscript("")
        setTranslatedText("")

        if (speechSupported && recognitionRef.current) {
          console.log("Speech recognition supported, starting recognition...")
          try {
            // Check if we have microphone permission first
            await navigator.mediaDevices.getUserMedia({ audio: true })
            console.log("Microphone permission granted")

            if (recognitionRef.current.state === "started") {
              console.log("Recognition already started, stopping first...")
              recognitionRef.current.stop()
              await new Promise((resolve) => setTimeout(resolve, 300))
            }

            recognitionRef.current.start()
            setIsListening(true)
            console.log("Real-time speech recognition started successfully")
          } catch (error) {
            console.log("Failed to start speech recognition:", error)
            console.log("Error details:", error)
            setIsRecording(false)
            alert("Microphone access is required for live transcription. Please allow microphone access and try again.")
          }
        } else {
          console.log("Speech recognition not supported or not initialized")
          console.log("speechSupported:", speechSupported)
          console.log("recognitionRef.current:", !!recognitionRef.current)
          setIsRecording(false)
          alert("Speech recognition is not supported in your browser. Please use the Record & Transcribe mode instead.")
        }
      } else {
        console.log("Starting traditional recording mode with real transcription...")
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        const chunks: BlobPart[] = []
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/wav" })
          setAudioBlob(blob)
          console.log("Recording stopped, blob created:", blob.size, "bytes")
          stream.getTracks().forEach((track) => track.stop())

          if (recognitionRef.current && isListening) {
            console.log("Stopping speech recognition for traditional mode...")
            try {
              recognitionRef.current.stop()
            } catch (error) {
              console.log("Error stopping recognition:", error)
            }
            setIsListening(false)
          }
        }

        mediaRecorder.start()
        setIsRecording(true)
        setRecordingTime(0)
        setTranscript("")
        setFinalTranscript("")
        setInterimTranscript("")
        setTranslatedText("")

        if (speechSupported && recognitionRef.current) {
          console.log("Starting speech recognition for real transcription in traditional mode...")
          try {
            if (recognitionRef.current.state === "started") {
              console.log("Recognition already started, stopping first...")
              recognitionRef.current.stop()
              await new Promise((resolve) => setTimeout(resolve, 300))
            }

            recognitionRef.current.start()
            setIsListening(true)
            console.log("Speech recognition started for traditional mode")
          } catch (error) {
            console.log("Failed to start speech recognition for traditional mode:", error)
          }
        }

        console.log("Traditional recording started successfully")
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsRecording(false)
      alert("Failed to start recording. Please check your microphone permissions and try again.")
    }
  }

  const stopRecording = () => {
    console.log("stopRecording called, isRecording:", isRecording)
    console.log("transcriptionMode:", transcriptionMode)
    console.log("isListening:", isListening)
    console.log("recognitionRef.current:", !!recognitionRef.current)

    setIsRecording(false)

    if (transcriptionMode === "live") {
      console.log("Processing live mode stop...")

      if (recognitionRef.current && isListening) {
        console.log("Stopping speech recognition...")
        try {
          recognitionRef.current.stop()
          console.log("Speech recognition stop() called successfully")
        } catch (error) {
          console.log("Error stopping recognition:", error)
        }
      } else {
        console.log("Speech recognition not active or not available")
        console.log("recognitionRef.current exists:", !!recognitionRef.current)
        console.log("isListening:", isListening)
      }

      setIsListening(false)

      const completeTranscript = (finalTranscript + interimTranscript).trim()
      console.log("Complete transcript:", completeTranscript)

      if (completeTranscript) {
        setTranscript(completeTranscript)
        setFinalTranscript("")
        setInterimTranscript("")
        saveTranscript(completeTranscript)
        console.log("Real-time transcription completed and saved:", completeTranscript)
      } else {
        console.log("No transcript to save")
      }
    }

    if (
      transcriptionMode === "traditional" &&
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      console.log("MediaRecorder is recording, calling stop()")
      mediaRecorderRef.current.stop()

      setIsListening(false)

      const completeTranscript = (finalTranscript + interimTranscript).trim()
      console.log("Traditional mode transcript from speech recognition:", completeTranscript)

      if (completeTranscript) {
        setTranscript(completeTranscript)
        setFinalTranscript("")
        setInterimTranscript("")
        saveTranscript(completeTranscript)
        console.log("Traditional transcription completed with real speech recognition:", completeTranscript)
      } else {
        console.log("No speech recognition transcript available, using fallback")
        setTranscript(
          "No speech detected. Please try speaking closer to the microphone or check your microphone settings.",
        )
      }
    }
  }

  const saveTranscript = async (transcriptText: string) => {
    try {
      const transcript: Transcript = {
        id: Date.now().toString(),
        user_id: user.id,
        title: `Recording ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        content: transcriptText,
        translatedContent: translatedText || undefined,
        audio_duration: recordingTime,
        created_at: new Date().toISOString(),
      }

      transcriptService.saveTranscript(transcript)

      console.log("Transcript saved successfully")
    } catch (error) {
      console.error("Error saving transcript:", error)
    }
  }

  const translateText = async (text: string, targetLang: string) => {
    setIsTranslating(true)
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
      )
      const data = await response.json()

      if (data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText)
      } else {
        console.log("Primary translation failed, using fallback")
        const fallbackResponse = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
        )
        const fallbackData = await fallbackResponse.json()

        if (fallbackData && fallbackData[0] && fallbackData[0][0]) {
          setTranslatedText(fallbackData[0][0][0])
        } else {
          setTranslatedText("Translation service temporarily unavailable. Please try again later.")
        }
      }
    } catch (error) {
      console.error("Translation error:", error)
      setTranslatedText("Translation failed. Please check your internet connection and try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSignOut = () => {
    authService.logout()
    router.push("/auth/login")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
        console.error("Audio playback error")
      }

      audio.play().catch((error) => {
        console.error("Failed to play audio:", error)
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      })
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handleModeChange = async (newMode: TranscriptionMode) => {
    if (isRecording) {
      return // Don't allow mode change while recording
    }

    // Stop any existing speech recognition
    if (recognitionRef.current && isListening) {
      console.log("Stopping speech recognition due to mode change...")
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.log("Error stopping recognition during mode change:", error)
      }
      setIsListening(false)
      // Wait for recognition to fully stop
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setTranscriptionMode(newMode)
    setTranscript("")
    setFinalTranscript("")
    setInterimTranscript("")
    setTranslatedText("")
  }

  if (showHistory) {
    return <TranscriptHistory user={user} onBack={() => setShowHistory(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-sans">Voice Transcription</h1>
            <p className="text-slate-600 font-sans">Welcome back, {user.email}</p>
            {speechSupported && transcriptionMode === "live" && (
              <p className="text-emerald-600 text-sm font-sans">✓ Real-time transcription enabled</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowHistory(true)}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <History className="h-4 w-4" />
              History
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800 font-sans">Transcription Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => handleModeChange("live")}
                variant={transcriptionMode === "live" ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  transcriptionMode === "live" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-transparent"
                }`}
                disabled={isRecording}
              >
                <Zap className="h-4 w-4" />
                Live Transcription
              </Button>
              <Button
                onClick={() => handleModeChange("traditional")}
                variant={transcriptionMode === "traditional" ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  transcriptionMode === "traditional"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-transparent"
                }`}
                disabled={isRecording}
              >
                <Clock className="h-4 w-4" />
                Record & Transcribe
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-2 font-sans">
              {transcriptionMode === "live"
                ? "Real-time transcription as you speak"
                : "Record first, then transcribe"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-slate-800 font-sans">
              {transcriptionMode === "live" ? "Live Voice Transcription" : "Record Your Voice"}
            </CardTitle>
            <p className="text-slate-600 font-sans">
              {transcriptionMode === "live"
                ? "Start recording to get real-time transcription as you speak"
                : "Record your voice and get AI transcription"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="flex gap-4">
                  {!isRecording && (
                    <Button
                      onClick={() => {
                        console.log("Start recording button clicked")
                        startRecording()
                      }}
                      size="lg"
                      className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-emerald-200"
                    >
                      <Mic className="h-8 w-8" />
                    </Button>
                  )}
                  {isRecording && (
                    <Button
                      onClick={() => {
                        console.log("Stop recording button clicked")
                        console.log("Current state - isRecording:", isRecording, "isListening:", isListening)
                        stopRecording()
                      }}
                      size="lg"
                      className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 animate-pulse shadow-lg shadow-red-200"
                    >
                      <Square className="h-8 w-8" />
                    </Button>
                  )}
                </div>
                {isRecording && transcriptionMode === "live" && (
                  <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping"></div>
                )}
              </div>

              <div className="text-center">
                <div className="text-sm font-medium text-slate-700 font-sans">
                  {transcriptionMode === "live"
                    ? isRecording
                      ? "Live transcription active - Click stop to save & translate"
                      : "Click microphone to start live transcription"
                    : isRecording
                      ? "Recording... Click stop when done"
                      : "Click microphone to start recording"}
                </div>
              </div>

              {transcriptionMode === "live" && isRecording && (finalTranscript || interimTranscript) && (
                <div className="w-full max-w-2xl bg-slate-50 p-4 rounded-lg border">
                  <div className="text-sm text-emerald-600 mb-2 font-sans">Live Transcript:</div>
                  <p className="text-slate-800 leading-relaxed font-sans">
                    {finalTranscript}
                    <span className="text-slate-500 italic">{interimTranscript}</span>
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              )}

              {isRecording && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 font-mono">{formatTime(recordingTime)}</div>
                  <div className="text-sm text-slate-600 font-sans">
                    {isListening ? "Listening and transcribing..." : "Recording in progress..."}
                  </div>
                </div>
              )}

              {isTranscribing && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-600">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-sans">Transcribing with AI...</span>
                  </div>
                </div>
              )}

              {audioBlob && !isRecording && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-sm text-slate-600 font-sans">
                    Recording complete • {formatTime(recordingTime)}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={playAudio} variant="outline" className="flex items-center gap-2 bg-transparent">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {transcript && !isRecording && !isTranscribing && (
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 font-sans flex items-center justify-between">
                Transcript
                <span className="text-sm font-normal text-emerald-500">
                  {transcript.includes("API setup") || transcript.includes("fallback")
                    ? "Setup Required"
                    : transcriptionMode === "live"
                      ? "Real-time transcription complete"
                      : "AI transcription complete"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-slate-700 leading-relaxed font-sans">{transcript}</p>
              </div>

              {!transcript.includes("API setup") && !transcript.includes("fallback") && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-800 mb-3 font-sans">Translate Transcript</h4>
                  <div className="flex items-center gap-4">
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="tr">Turkish</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => translateText(transcript, targetLanguage)}
                      disabled={isTranslating}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isTranslating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          Translating...
                        </>
                      ) : (
                        <>
                          <Languages className="h-4 w-4" />
                          Translate
                        </>
                      )}
                    </Button>
                  </div>

                  {translatedText && (
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mt-4">
                      <h4 className="font-semibold text-emerald-800 mb-2 font-sans">Translation:</h4>
                      <p className="text-emerald-700 leading-relaxed font-sans">{translatedText}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
