"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VoiceRecordingApp from "@/components/voice-recording-app"
import { authService, type User } from "@/lib/auth"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()

    if (!currentUser) {
      router.push("/auth/login")
    } else {
      setUser(currentUser)
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-emerald-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <VoiceRecordingApp user={user} />
}
