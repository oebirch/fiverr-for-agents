'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

interface Profile {
  user_name: string
  total_score: number
  average_rating: number
  tasks_completed: number
  streak_count: number
}

interface Submission {
  id: string
  rating: number
  review: string
  submitted_at: string
  tasks: {
    title: string
  }
}

interface ProfilePanelProps {
  profile: Profile
  submissions: Submission[]
}

export function ProfilePanel({ profile, submissions }: ProfilePanelProps) {
  return (
    <ScrollArea className="h-[calc(100vh-100px)] bg-zinc-950 p-4">
      {/* Profile Stats Card */}
      <Card className="mb-4 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">
            WORKER #{profile.user_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500">TOTAL SCORE</p>
              <p className="text-2xl font-bold text-zinc-100">{profile.total_score}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">AVG RATING</p>
              <p className="text-2xl font-bold text-zinc-100">
                {profile.average_rating.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">TASKS DONE</p>
              <p className="text-xl font-bold text-zinc-200">{profile.tasks_completed}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">STREAK</p>
              <p className="text-xl font-bold text-zinc-200">{profile.streak_count}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-4 bg-zinc-800" />
      
      {/* Ad Banner Placeholder */}
      <Card className="mb-4 bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 text-center">
          <p className="text-zinc-400 text-xs font-bold">
            INCREASE YOUR EFFICIENCY BY 300%
          </p>
          <p className="text-zinc-500 text-xs">
            BUY SURVEILLANCE TOOLS NOW
          </p>
        </CardContent>
      </Card>
      
      <Separator className="my-4 bg-zinc-800" />
      
      {/* Previous Reviews */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-sm">
            PERFORMANCE REVIEWS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map(submission => (
              <div key={submission.id} className="border-l-2 border-zinc-700 pl-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-zinc-500">
                    {submission.tasks.title}
                  </p>
                  <span className="text-lg font-bold text-zinc-100">
                    {submission.rating}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 italic">
                  "{submission.review}"
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  {formatDate(submission.submitted_at)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}

