'use client'

import { useState, useEffect, useRef } from 'react'
import { formatTime } from '@/lib/utils'

interface TimerDisplayProps {
  maxTime: number
  isActive: boolean
  onTimeUp?: () => void
}

export function TimerDisplay({ maxTime, isActive, onTimeUp }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [position, setPosition] = useState({ top: 20, left: 20 })
  const [currentMaxTime, setCurrentMaxTime] = useState(maxTime)
  const timeLeftRef = useRef(maxTime)
  const maxTimeRef = useRef(maxTime)

  // Keep refs in sync
  useEffect(() => {
    timeLeftRef.current = timeLeft
    maxTimeRef.current = maxTime
  }, [timeLeft, maxTime])

  // Reset timer whenever maxTime changes (new task started)
  useEffect(() => {
    if (maxTime !== currentMaxTime) {
      setTimeLeft(maxTime)
      setCurrentMaxTime(maxTime)
    }
  }, [maxTime, currentMaxTime])

  // Reset timer when task becomes active
  useEffect(() => {
    if (isActive) {
      setTimeLeft(maxTime)
      setCurrentMaxTime(maxTime)
    }
  }, [isActive, maxTime])

  // Countdown timer
  useEffect(() => {
    if (!isActive) {
      return
    }

    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newValue = prev - 1
        if (newValue <= 0) {
          return 0
        }
        return newValue
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isActive, onTimeUp])

  // Animation: Move around screen corners (speed up as time runs out)
  useEffect(() => {
    if (!isActive) return

    let lastTime = Date.now()
    let cumulativeProgress = 0 // 0 to 1, wraps around
    let animationFrameId: number
    
    const animate = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      lastTime = now
      
      // Use refs to get current values without causing effect restart
      const currentTimeLeft = timeLeftRef.current
      const currentMaxTime = maxTimeRef.current
      
      // Speed multiplier: gets faster as timeLeft decreases
      // When timeLeft = maxTime, speed = 1x
      // When timeLeft = 0, speed = 4x
      const urgencyMultiplier = currentTimeLeft > 0 && currentMaxTime > 0
        ? 1 + (3 * (1 - currentTimeLeft / currentMaxTime)) 
        : 4
      const baseCycleDuration = 60000 // 60 seconds at normal speed
      const cycleDuration = baseCycleDuration / urgencyMultiplier
      
      // Increment progress based on time elapsed and current speed
      const progressIncrement = deltaTime / cycleDuration
      cumulativeProgress = (cumulativeProgress + progressIncrement) % 1 // Keep between 0-1
      
      const progress = cumulativeProgress // 0 to 1, loops continuously
      
      // Define 4 corners using only top and left (absolute positions)
      const margin = 20
      const timerWidth = 200
      const timerHeight = 100
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      // Corner positions: [top, left]
      const corners = [
        [margin, margin],                                          // Top-left
        [margin, screenWidth - timerWidth - margin],              // Top-right
        [screenHeight - timerHeight - margin, screenWidth - timerWidth - margin], // Bottom-right
        [screenHeight - timerHeight - margin, margin],            // Bottom-left
      ]
      
      // Determine which segment we're in (0-3)
      const segmentIndex = Math.floor(progress * 4)
      const segmentProgress = (progress * 4) % 1 // Progress within current segment (0 to 1)
      
      // Get current and next corner
      const currentCorner = corners[segmentIndex]
      const nextCorner = corners[(segmentIndex + 1) % 4]
      
      // Linear interpolation between corners
      const top = currentCorner[0] + (nextCorner[0] - currentCorner[0]) * segmentProgress
      const left = currentCorner[1] + (nextCorner[1] - currentCorner[1]) * segmentProgress
      
      setPosition({ top, left })
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transition: 'none', // Smooth via requestAnimationFrame, not CSS
      }}
    >
      <div className="relative">
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 bg-red-600 rounded-lg blur-xl animate-pulse opacity-75"></div>
        
        {/* Timer display */}
        <div className="relative bg-red-600 text-white text-5xl font-mono font-bold px-8 py-4 rounded-lg shadow-2xl border-4 border-red-400 animate-pulse">
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  )
}

