'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface TaskCaptchaProps {
  isOpen: boolean
  onSuccess: () => void
  onClose: () => void
}

// Dystopian captcha categories
const CAPTCHA_CHALLENGES = [
  {
    prompt: "SELECT ALL IMAGES CONTAINING PRODUCTIVITY",
    correctIndices: [0, 2, 4, 6, 8] // Ambiguous!
  },
  {
    prompt: "SELECT ALL IMAGES SHOWING EFFICIENCY",
    correctIndices: [1, 3, 5, 7]
  },
  {
    prompt: "SELECT ALL IMAGES WITH SURVEILLANCE EQUIPMENT",
    correctIndices: [0, 1, 4, 5, 8]
  },
  {
    prompt: "IDENTIFY ALL COMPLIANT WORKERS",
    correctIndices: [2, 4, 6]
  }
]

export function TaskCaptcha({ isOpen, onSuccess, onClose }: TaskCaptchaProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [challenge, setChallenge] = useState(CAPTCHA_CHALLENGES[0])
  const [showVerify, setShowVerify] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [round, setRound] = useState(1)

  useEffect(() => {
    if (isOpen) {
      // Reset state when opened
      setSelected([])
      setShowVerify(false)
      setError('')
      setRound(1)
      // Pick random challenge
      setChallenge(CAPTCHA_CHALLENGES[Math.floor(Math.random() * CAPTCHA_CHALLENGES.length)])
    }
  }, [isOpen])

  useEffect(() => {
    // Show verify button only after selecting at least 2 boxes (annoying!)
    if (selected.length >= 2) {
      // Annoying delay before showing verify button
      setTimeout(() => setShowVerify(true), 1000)
    } else {
      setShowVerify(false)
    }
  }, [selected])

  const toggleSelection = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
    } else {
      setSelected([...selected, index])
    }
    setError('')
  }

  const handleVerify = () => {
    setIsVerifying(true)
    
    // Annoying verification delay
    setTimeout(() => {
      // Check if selection matches (with some tolerance for ambiguity)
      const isCorrect = challenge.correctIndices.every(i => selected.includes(i)) &&
                       selected.length === challenge.correctIndices.length
      
      if (isCorrect) {
        // Sometimes make them do it again (extra annoying!)
        if (round === 1 && Math.random() > 0.5) {
          setRound(2)
          setSelected([])
          setShowVerify(false)
          setError('VERIFICATION INCOMPLETE. TRY AGAIN.')
          setChallenge(CAPTCHA_CHALLENGES[Math.floor(Math.random() * CAPTCHA_CHALLENGES.length)])
          setIsVerifying(false)
        } else {
          // Success after annoying delay
          setTimeout(() => {
            onSuccess()
          }, 500)
        }
      } else {
        setError('INCORRECT. PLEASE TRY AGAIN.')
        setSelected([])
        setShowVerify(false)
        setIsVerifying(false)
      }
    }, 2000) // 2 second annoying delay
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-[500px] bg-zinc-900 border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-zinc-100 text-sm font-mono">
            HUMAN VERIFICATION REQUIRED
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-zinc-400 text-xs font-mono mb-1">
              {challenge.prompt}
            </p>
            {round > 1 && (
              <p className="text-red-400 text-xs font-mono animate-pulse">
                VERIFICATION ROUND {round}
              </p>
            )}
          </div>

          {/* Captcha Grid */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-zinc-950 rounded">
            {Array.from({ length: 9 }).map((_, index) => (
              <button
                key={index}
                onClick={() => toggleSelection(index)}
                className={`aspect-square border-2 transition-all duration-200 rounded ${
                  selected.includes(index)
                    ? 'border-red-500 bg-red-950/50'
                    : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
                  {/* Placeholder for images - using indices for now */}
                  IMG_{index + 1}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="text-red-400 text-xs font-mono text-center animate-pulse">
              {error}
            </div>
          )}

          {showVerify && (
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700"
            >
              {isVerifying ? 'VERIFYING...' : 'VERIFY'}
            </Button>
          )}

          {!showVerify && selected.length > 0 && (
            <p className="text-zinc-600 text-xs text-center font-mono">
              Processing your selection...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
