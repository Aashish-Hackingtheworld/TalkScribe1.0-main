"use client"

import { useEffect, useState } from "react"

interface AudioElement {
  id: number
  x: number
  y: number
  size: number
  speed: number
  direction: number
  opacity: number
  type: "soundwave" | "microphone" | "note" | "frequency" | "pulse"
  phase: number
}

export default function AnimatedBackground() {
  const [elements, setElements] = useState<AudioElement[]>([])

  useEffect(() => {
    // Generate random audio-themed elements
    const generateElements = () => {
      const newElements: AudioElement[] = []
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 15,
          speed: Math.random() * 0.3 + 0.05,
          direction: Math.random() * 360,
          opacity: Math.random() * 0.15 + 0.05,
          type: ["soundwave", "microphone", "note", "frequency", "pulse"][
            Math.floor(Math.random() * 5)
          ] as AudioElement["type"],
          phase: Math.random() * Math.PI * 2,
        })
      }
      setElements(newElements)
    }

    generateElements()

    // Animate elements
    const animateElements = () => {
      setElements((prevElements) =>
        prevElements.map((element) => {
          let newX = element.x + Math.cos(element.direction) * element.speed
          let newY = element.y + Math.sin(element.direction) * element.speed
          const newPhase = element.phase + 0.1

          // Wrap around screen edges
          if (newX > 105) newX = -5
          if (newX < -5) newX = 105
          if (newY > 105) newY = -5
          if (newY < -5) newY = 105

          return {
            ...element,
            x: newX,
            y: newY,
            phase: newPhase,
          }
        }),
      )
    }

    const interval = setInterval(animateElements, 80)
    return () => clearInterval(interval)
  }, [])

  const getAudioElement = (element: AudioElement) => {
    const baseClasses = "absolute transition-all duration-1000 ease-in-out"
    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      opacity: element.opacity,
      transform: `rotate(${element.direction}deg)`,
    }

    switch (element.type) {
      case "soundwave":
        return (
          <div key={element.id} className={baseClasses} style={style}>
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <path
                d={`M0,10 Q10,${5 + Math.sin(element.phase) * 3} 20,10 Q30,${15 + Math.cos(element.phase) * 3} 40,10`}
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d={`M0,10 Q10,${8 + Math.sin(element.phase + 1) * 2} 20,10 Q30,${12 + Math.cos(element.phase + 1) * 2} 40,10`}
                stroke="rgb(5 150 105)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </div>
        )

      case "microphone":
        return (
          <div key={element.id} className={baseClasses} style={style}>
            <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-400">
              <path fill="currentColor" opacity="0.6" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path
                fill="currentColor"
                opacity="0.4"
                d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0Z"
              />
              <path fill="currentColor" opacity="0.6" d="M12 18.5a1 1 0 0 1 1 1V22a1 1 0 1 1-2 0v-2.5a1 1 0 0 1 1-1Z" />
            </svg>
          </div>
        )

      case "note":
        return (
          <div key={element.id} className={baseClasses} style={style}>
            <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500">
              <path
                fill="currentColor"
                opacity="0.5"
                d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                transform={`scale(${0.8 + Math.sin(element.phase) * 0.2})`}
                transformOrigin="center"
              />
            </svg>
          </div>
        )

      case "frequency":
        return (
          <div key={element.id} className={baseClasses} style={style}>
            <div className="flex items-end justify-center space-x-1 w-full h-full">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-emerald-400 rounded-sm opacity-60"
                  style={{
                    width: "3px",
                    height: `${30 + Math.sin(element.phase + i * 0.5) * 20}%`,
                    transition: "height 0.1s ease",
                  }}
                />
              ))}
            </div>
          </div>
        )

      case "pulse":
        return (
          <div key={element.id} className={baseClasses} style={style}>
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 rounded-full bg-emerald-400"
                style={{
                  opacity: 0.3,
                  transform: `scale(${0.5 + Math.sin(element.phase) * 0.3})`,
                }}
              />
              <div
                className="absolute inset-2 rounded-full bg-emerald-500"
                style={{
                  opacity: 0.4,
                  transform: `scale(${0.7 + Math.cos(element.phase + 1) * 0.2})`,
                }}
              />
              <div className="absolute inset-4 rounded-full bg-emerald-600 opacity-50" />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient overlay with audio theme */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 animate-pulse"
        style={{ animationDuration: "8s" }}
      />

      {/* Secondary gradient that shifts like sound waves */}
      <div
        className="absolute inset-0 bg-gradient-to-tl from-emerald-100/30 via-transparent to-emerald-200/20 animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "2s" }}
      />

      {/* Audio-themed floating elements */}
      {elements.map((element) => getAudioElement(element))}

      {/* Subtle radial gradients for depth - like sound ripples */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "3s" }}
      />

      {/* Additional sound wave ripples */}
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-400/5 rounded-full blur-2xl animate-ping"
        style={{ animationDuration: "4s", transform: "translate(-50%, -50%)" }}
      />
    </div>
  )
}
