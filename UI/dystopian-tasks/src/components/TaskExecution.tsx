'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { calculateTokens } from '@/lib/utils'

interface Task {
  id: string
  title: string
  body: string
  time_allowed_to_complete: number
  options?: string[] | null
}

interface TaskExecutionProps {
  task: Task | null
  onSubmit: (data: { taskId: string; textResponse: string; imageUrls: string[] }) => void
  onResponseChange?: (response: { textResponse: string; imageUrls: string[]; selectedOption: string | null }) => void
}

export function TaskExecution({ task, onSubmit, onResponseChange }: TaskExecutionProps) {
  const [textResponse, setTextResponse] = useState('')
  const [imageUrl1, setImageUrl1] = useState('')
  const [imageUrl2, setImageUrl2] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Notify parent of response changes
  useEffect(() => {
    if (onResponseChange) {
      onResponseChange({
        textResponse,
        imageUrls: [imageUrl1, imageUrl2].filter(url => url.trim() !== ''),
        selectedOption
      })
    }
  }, [textResponse, imageUrl1, imageUrl2, selectedOption, onResponseChange])

  // Determine if this is a multiple choice task
  const isMultipleChoice = task?.options && task.options.length > 0

  const handleSubmit = () => {
    if (!task) return
    
    // For multiple choice: submit only the selected option
    if (isMultipleChoice) {
      if (!selectedOption) return
      onSubmit({ taskId: task.id, textResponse: selectedOption, imageUrls: [] })
    } else {
      // For free text: submit text and images
      if (!textResponse) return
      const imageUrls = [imageUrl1, imageUrl2].filter(url => url.trim() !== '')
      onSubmit({ taskId: task.id, textResponse, imageUrls })
    }
    
    setSubmitted(true)
  }

  if (!task) {
    return (
      <div className="h-[calc(100vh-100px)] bg-zinc-900 p-4 flex items-center justify-center">
        <Card className="bg-zinc-950 border-zinc-800 max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-500 text-lg mb-2">NO ACTIVE TASK</p>
            <p className="text-zinc-600 text-sm">
              Select a task from the list to begin
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tokensEarned = calculateTokens(task.time_allowed_to_complete, task.body.length);
  
  return (
    <div className="h-[calc(100vh-100px)] bg-zinc-900 p-4 overflow-y-auto">
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-zinc-100 text-2xl">
              {task.title}
            </CardTitle>
            <div className="bg-yellow-600 text-zinc-950 px-3 py-1 rounded font-bold text-sm">
              🪙 {tokensEarned} tokens
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Task Body */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">TASK DETAILS</h3>
            <p className="text-zinc-300 whitespace-pre-wrap">{task.body}</p>
          </div>
          
          <Separator className="bg-zinc-800" />
          
          {/* Multiple Choice Options */}
          {isMultipleChoice ? (
            <div>
              <label className="text-sm font-semibold text-zinc-400 mb-3 block">
                SELECT YOUR RESPONSE (REQUIRED)
              </label>
              <div className="grid gap-3">
                {task.options!.map((option, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedOption === option
                        ? 'bg-blue-600 border-blue-500'
                        : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                    } ${submitted ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => !submitted && setSelectedOption(option)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className={`text-base ${
                          selectedOption === option ? 'text-white font-semibold' : 'text-zinc-300'
                        }`}>
                          {option}
                        </p>
                        {selectedOption === option && (
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Text Response */}
              <div>
                <label className="text-sm font-semibold text-zinc-400 mb-2 block">
                  TEXT RESPONSE (REQUIRED)
                </label>
                <Textarea
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  className="min-h-[200px] bg-zinc-900 border-zinc-700 text-zinc-200 font-mono"
                  placeholder="Enter your response here..."
                  disabled={submitted}
                />
              </div>
              
              {/* Image URLs */}
              <div>
                <label className="text-sm font-semibold text-zinc-400 mb-2 block">
                  IMAGE URLS (OPTIONAL)
                </label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image1.png"
                    value={imageUrl1}
                    onChange={(e) => setImageUrl1(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-zinc-200"
                    disabled={submitted}
                  />
                  <Input
                    type="url"
                    placeholder="https://example.com/image2.png"
                    value={imageUrl2}
                    onChange={(e) => setImageUrl2(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-zinc-200"
                    disabled={submitted}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Paste publicly accessible image URLs
                </p>
              </div>
            </>
          )}
          
          {/* Submit Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full text-lg font-bold"
            onClick={handleSubmit}
            disabled={submitted || (isMultipleChoice ? !selectedOption : !textResponse)}
          >
            {submitted ? 'SUBMITTED - AWAITING REVIEW' : 'SUBMIT WORK'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

