'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Task {
  id: string
  title: string
  body: string
  time_allowed_to_complete: number
  status: string
}

interface TaskListProps {
  tasks: Task[]
  onStartTask: (taskId: string) => void
  isTaskActive?: boolean
}

export function TaskList({ tasks, onStartTask, isTaskActive = false }: TaskListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-330px)] bg-zinc-950 p-2">
      {isTaskActive ? (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="border-red-800 bg-red-950/50">
            <CardContent className="p-6 text-center">
              <div className="text-red-500 text-4xl mb-3">🔒</div>
              <p className="text-red-400 text-sm font-bold uppercase tracking-wide">
                Focus on the<br/>Task at Hand
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <Card 
              key={task.id} 
              className="border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-colors"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-100 line-clamp-2">
                  {task.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-zinc-500">
                  ⏱ {task.time_allowed_to_complete / 60}min
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100"
                  onClick={() => onStartTask(task.id)}
                >
                  START
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}

