'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Task {
  id: string
  title: string
  body: string
  time_allowed_to_complete: number
}

interface TaskExecutionProps {
  task: Task | null
  onSubmit: (data: { taskId: string; textResponse: string; imageUrls: string[] }) => void
}

export function TaskExecution({ task, onSubmit }: TaskExecutionProps) {
  const [textResponse, setTextResponse] = useState('')
  const [imageUrl1, setImageUrl1] = useState('')
  const [imageUrl2, setImageUrl2] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!task || !textResponse) return
    
    const imageUrls = [imageUrl1, imageUrl2].filter(url => url.trim() !== '')
    onSubmit({ taskId: task.id, textResponse, imageUrls })
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

  return (
    <div className="h-[calc(100vh-100px)] bg-zinc-900 p-4 overflow-y-auto">
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-2xl">
            {task.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Task Body */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">TASK DETAILS</h3>
            <p className="text-zinc-300 whitespace-pre-wrap">{task.body}</p>
          </div>
          
          <Separator className="bg-zinc-800" />
          
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
          
          {/* Submit Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full text-lg font-bold"
            onClick={handleSubmit}
            disabled={submitted || !textResponse}
          >
            {submitted ? 'SUBMITTED - AWAITING REVIEW' : 'SUBMIT WORK'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

