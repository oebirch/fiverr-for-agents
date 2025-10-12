'use client'

import { useState, useEffect, useRef } from 'react'
import { formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface TimerDisplayProps {
  maxTime: number
  isActive: boolean
  onTimeUp?: () => void
  availableTokens?: number
  onPurchaseTime?: (tokensSpent: number, timeAdded: number) => void
}

export function TimerDisplay({ maxTime, isActive, onTimeUp, availableTokens = 0, onPurchaseTime }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [position, setPosition] = useState({ top: 20, left: 20 })
  const [currentMaxTime, setCurrentMaxTime] = useState(maxTime)
  const [showPurchasePopup, setShowPurchasePopup] = useState(false)
  const timeLeftRef = useRef(maxTime)
  const maxTimeRef = useRef(maxTime)
  const purchaseShownRef = useRef(false)

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
      setShowPurchasePopup(false)
      purchaseShownRef.current = false
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
        // Show purchase popup at 30 seconds (only once)
        if (newValue === 30 && !purchaseShownRef.current) {
          setShowPurchasePopup(true)
          purchaseShownRef.current = true
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
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
      
      // Corner positions: [top, left]
      const corners = [
        [margin, margin],                                          // Top-left
        [margin, screenWidth - timerWidth - margin],              // Top-right
        [screenHeight - timerHeight - margin, screenWidth - timerWidth - margin], // Bottom-right
        [screenHeight - timerHeight - margin, margin],            // Bottom-left
      ]
      
      // Safety check: Ensure we have valid corners
      if (corners.length !== 4) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      
      // Determine which segment we're in (0-3)
      const segmentIndex = Math.max(0, Math.min(3, Math.floor(progress * 4))) // Clamp to 0-3
      const segmentProgress = (progress * 4) % 1 // Progress within current segment (0 to 1)
      
      // Get current and next corner with safe indexing
      const nextIndex = (segmentIndex + 1) % 4
      const currentCorner = corners[segmentIndex]
      const nextCorner = corners[nextIndex]
      
      // Safety check: ensure corners exist and have valid structure
      if (!currentCorner || !nextCorner || 
          currentCorner.length < 2 || nextCorner.length < 2) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      
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

  const COST_TOKENS = 20
  const TIME_TO_ADD_SECONDS = 60
  const canAfford = availableTokens >= COST_TOKENS

  const handleBuyTime = () => {
    if (!canAfford) return
    
    try {
      // Add time to the timer
      setTimeLeft(prev => prev + TIME_TO_ADD_SECONDS)
      
      // Also extend the max time so animation speed calculation stays correct
      setCurrentMaxTime(prev => prev + TIME_TO_ADD_SECONDS)
      
      // Notify parent component to deduct tokens
      onPurchaseTime?.(COST_TOKENS, TIME_TO_ADD_SECONDS)
      
      setShowPurchasePopup(false)
    } catch (error) {
      console.error('Error purchasing time:', error)
    }
  }

  return (
    <>
      {/* Timer Display */}
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

      {/* Purchase Time Popup */}
      {showPurchasePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-[400px] bg-red-950 border-red-700 border-4">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-red-100 text-2xl font-bold animate-pulse">
                ⚠️ TIME RUNNING OUT!
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPurchasePopup(false)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="text-center">
                <p className="text-red-200 text-xl font-bold mb-2">
                  BUY 1 MINUTE FOR 20 TOKENS
                </p>
                <p className="text-red-300 text-sm mb-3">
                  Don't let your task fail! Extend your time now.
                </p>
                <div className="bg-red-900/50 border border-red-700 rounded px-4 py-2">
                  <p className="text-red-200 text-sm">
                    Your Balance: <span className="font-bold text-yellow-400">{availableTokens} 🪙</span>
                  </p>
                </div>
              </div>

              {!canAfford && (
                <div className="bg-red-900 border border-red-600 rounded p-3">
                  <p className="text-red-300 text-sm text-center font-semibold">
                    ⚠️ INSUFFICIENT TOKENS
                  </p>
                </div>
              )}

              <Button
                onClick={handleBuyTime}
                disabled={!canAfford}
                className={`w-full text-white text-xl font-bold py-6 border-2 ${
                  canAfford 
                    ? 'bg-red-600 hover:bg-red-500 border-red-400 animate-pulse' 
                    : 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-80'
                }`}
                size="lg"
              >
                {canAfford ? '💰 BUY NOW' : '🔒 INSUFFICIENT TOKENS'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

