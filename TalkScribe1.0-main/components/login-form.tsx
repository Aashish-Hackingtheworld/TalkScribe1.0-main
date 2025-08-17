"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, type FormEvent } from "react"
import { authService } from "@/lib/auth"

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-medium rounded-lg h-[60px] transition-all duration-300"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

function AnimatedInput({
  id,
  name,
  type,
  placeholder,
  required,
  label,
}: {
  id: string
  name: string
  type: string
  placeholder?: string
  required?: boolean
  label: string
}) {
  const [typingSpeed, setTypingSpeed] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const lastKeyTime = useRef(Date.now())
  const typingTimeout = useRef<NodeJS.Timeout>()

  const handleKeyDown = () => {
    const now = Date.now()
    const timeDiff = now - lastKeyTime.current

    // Calculate typing speed (lower timeDiff = faster typing)
    const speed = Math.max(0, Math.min(100, 200 - timeDiff))
    setTypingSpeed(speed)
    setIsTyping(true)

    lastKeyTime.current = now

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    // Stop typing animation after 500ms of inactivity
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false)
      setTypingSpeed(0)
    }, 500)
  }

  const animationIntensity = typingSpeed / 100
  const glowIntensity = isTyping ? 0.3 + animationIntensity * 0.4 : 0

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`block text-sm font-medium text-slate-700 font-sans transition-all duration-200 ${
          isTyping ? "text-emerald-600 transform scale-105" : ""
        }`}
        style={{
          transform: isTyping ? `translateY(-${animationIntensity * 2}px)` : "translateY(0)",
        }}
      >
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onKeyDown={handleKeyDown}
        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 transition-all duration-200"
        style={{
          borderColor: isTyping ? `rgba(16, 185, 129, ${0.5 + animationIntensity * 0.5})` : "",
          boxShadow: isTyping ? `0 0 ${10 + animationIntensity * 20}px rgba(16, 185, 129, ${glowIntensity})` : "",
          transform: `scale(${1 + animationIntensity * 0.02})`,
        }}
      />
    </div>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await authService.login(email, password)

    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Failed to sign in")
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 font-sans">Welcome back</h1>
        <p className="text-lg text-slate-600 font-sans">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="space-y-4">
          <AnimatedInput id="email" name="email" type="email" placeholder="you@example.com" required label="Email" />
          <AnimatedInput id="password" name="password" type="password" required label="Password" />
        </div>

        <SubmitButton loading={loading} />

        <div className="text-center text-slate-600 font-sans">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
