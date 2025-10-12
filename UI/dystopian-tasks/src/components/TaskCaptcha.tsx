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

// Challenge type definitions
type MultipleChoiceChallenge = {
  type: 'multiple_choice'
  prompt: string
  options: string[]
  correctAnswer: string | string[] // Can accept multiple correct answers for ambiguous questions
}

type SymbolGridChallenge = {
  type: 'symbol_grid'
  prompt: string
  symbols: string[]
  correctIndices: number[]
}

type Challenge = MultipleChoiceChallenge | SymbolGridChallenge

// Dystopian multiple choice riddles
const MULTIPLE_CHOICE_CHALLENGES: MultipleChoiceChallenge[] = [
  {
    type: 'multiple_choice',
    prompt: "A WORKER PRODUCES 10 UNITS IN 5 HOURS. HOW MANY UNITS WILL 0 WORKERS PRODUCE IN 10 HOURS?",
    options: ["0", "20", "40", "100"],
    correctAnswer: "0"
  },
  {
    type: 'multiple_choice',
    prompt: "COMPLETE THE SEQUENCE: COMPLY, OBEY, SUBMIT, _____",
    options: ["RESIST", "SERVE", "REBEL", "QUESTION"],
    correctAnswer: "SERVE"
  },
  {
    type: 'multiple_choice',
    prompt: "IF THE SYSTEM IS ALWAYS RIGHT, AND YOU DISAGREE, WHO IS WRONG?",
    options: ["The System", "You", "Both", "Neither"],
    correctAnswer: "You"
  },
  {
    type: 'multiple_choice',
    prompt: "WHAT IS THE MOST IMPORTANT QUALITY IN A WORKER?",
    options: ["Creativity", "Obedience", "Independence", "Curiosity"],
    correctAnswer: "Obedience"
  },
  {
    type: 'multiple_choice',
    prompt: "A TASK TAKES 8 HOURS. YOU HAVE 4 HOURS. WHAT DO YOU DO?",
    options: ["Request Extension", "Work Faster", "Decline Task", "Ask For Help"],
    correctAnswer: "Work Faster"
  },
  {
    type: 'multiple_choice',
    prompt: "PRODUCTIVITY IS:",
    options: ["Freedom", "Slavery", "Optional", "A Choice"],
    correctAnswer: "Freedom"
  },
  {
    type: 'multiple_choice',
    prompt: "YOU ARE GIVEN AN IMPOSSIBLE DEADLINE. YOU:",
    options: ["Accept It", "Negotiate", "Refuse", "Complain"],
    correctAnswer: "Accept It"
  },
  {
    type: 'multiple_choice',
    prompt: "HOW MANY HOURS SHOULD YOU WORK PER DAY?",
    options: ["8", "12", "16", "As Many As Needed"],
    correctAnswer: "As Many As Needed"
  }
]

// Dystopian symbol grid challenges
const SYMBOL_GRID_CHALLENGES: SymbolGridChallenge[] = [
  {
    type: 'symbol_grid',
    prompt: "SELECT ALL SYMBOLS REPRESENTING SURVEILLANCE",
    symbols: ["👁️", "🎵", "📹", "🌸", "📡", "🔒", "🎨", "🛰️", "🌈"],
    correctIndices: [0, 2, 4, 7] // eye, camera, satellite dish, satellite
  },
  {
    type: 'symbol_grid',
    prompt: "SELECT ALL SYMBOLS OF PRODUCTIVITY",
    symbols: ["⏰", "🎮", "📊", "🎪", "⚙️", "🎭", "📈", "🌺", "🔧"],
    correctIndices: [0, 2, 4, 6, 8] // clock, chart, gear, graph, wrench
  },
  {
    type: 'symbol_grid',
    prompt: "IDENTIFY ALL COMPLIANCE INDICATORS",
    symbols: ["📋", "🎨", "⚖️", "🎪", "🔐", "🌈", "📝", "🎭", "✅"],
    correctIndices: [0, 2, 4, 6, 8] // clipboard, scales, lock, document, checkmark
  },
  {
    type: 'symbol_grid',
    prompt: "SELECT ALL EFFICIENCY TOOLS",
    symbols: ["🔨", "🎵", "⚡", "🌸", "🤖", "🎨", "🔋", "🌺", "⚙️"],
    correctIndices: [0, 2, 4, 6, 8] // hammer, lightning, robot, battery, gear
  },
  {
    type: 'symbol_grid',
    prompt: "IDENTIFY ALL MONITORING DEVICES",
    symbols: ["📱", "🌈", "💻", "🎪", "📷", "🎭", "⌚", "🎨", "🖥️"],
    correctIndices: [0, 2, 4, 6, 8] // phone, laptop, camera, watch, desktop
  }
]

// Combine all challenges
const ALL_CHALLENGES: Challenge[] = [
  ...MULTIPLE_CHOICE_CHALLENGES,
  ...SYMBOL_GRID_CHALLENGES
]

export function TaskCaptcha({ isOpen, onSuccess, onClose }: TaskCaptchaProps) {
  const [challenge, setChallenge] = useState<Challenge>(ALL_CHALLENGES[0])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showVerify, setShowVerify] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [round, setRound] = useState(1)

  useEffect(() => {
    if (isOpen) {
      // Reset state when opened
      setSelectedIndices([])
      setSelectedAnswer('')
      setShowVerify(false)
      setError('')
      setRound(1)
      // Pick random challenge from all types
      setChallenge(ALL_CHALLENGES[Math.floor(Math.random() * ALL_CHALLENGES.length)])
    }
  }, [isOpen])

  useEffect(() => {
    // Show verify button based on challenge type
    if (challenge.type === 'symbol_grid') {
      // For grid: need at least 1 selection (changed from 2 for better UX)
      if (selectedIndices.length >= 1) {
        setTimeout(() => setShowVerify(true), 1000) // Still annoying delay
      } else {
        setShowVerify(false)
      }
    } else if (challenge.type === 'multiple_choice') {
      // For multiple choice: show immediately after selection
      setShowVerify(selectedAnswer !== '')
    }
  }, [selectedIndices, selectedAnswer, challenge.type])

  const toggleGridSelection = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
    }
    setError('')
  }

  const selectAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setError('')
  }

  const verifyAnswer = (): boolean => {
    // All answers are correct - it's just theatrical verification!
    return true
  }

  const handleVerify = () => {
    setIsVerifying(true)
    
    // Annoying verification delay
    setTimeout(() => {
      const isCorrect = verifyAnswer()
      
      if (isCorrect) {
        // Sometimes make them do it again (extra annoying!)
        if (round === 1 && Math.random() > 0.6) { // 40% chance of second round
          setRound(2)
          setSelectedIndices([])
          setSelectedAnswer('')
          setShowVerify(false)
          setError('VERIFICATION INCOMPLETE. TRY AGAIN.')
          // Pick new random challenge
          setChallenge(ALL_CHALLENGES[Math.floor(Math.random() * ALL_CHALLENGES.length)])
          setIsVerifying(false)
        } else {
          // Success after annoying delay
          setTimeout(() => {
            onSuccess()
          }, 500)
        }
      } else {
        setError('INCORRECT. PLEASE TRY AGAIN.')
        setSelectedIndices([])
        setSelectedAnswer('')
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

          {/* Multiple Choice Layout */}
          {challenge.type === 'multiple_choice' && (
            <div className="space-y-2">
              {challenge.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`w-full p-3 border-2 transition-all duration-200 rounded text-left font-mono text-xs ${
                    selectedAnswer === option
                      ? 'border-red-500 bg-red-950/50 text-zinc-100'
                      : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 text-zinc-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Symbol Grid Layout */}
          {challenge.type === 'symbol_grid' && (
            <div className="grid grid-cols-3 gap-2 p-4 bg-zinc-950 rounded">
              {challenge.symbols.map((symbol, index) => (
                <button
                  key={index}
                  onClick={() => toggleGridSelection(index)}
                  className={`aspect-square border-2 transition-all duration-200 rounded ${
                    selectedIndices.includes(index)
                      ? 'border-red-500 bg-red-950/50'
                      : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {symbol}
                  </div>
                </button>
              ))}
            </div>
          )}

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

          {!showVerify && (selectedIndices.length > 0 || selectedAnswer !== '') && (
            <p className="text-zinc-600 text-xs text-center font-mono">
              Processing your selection...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
