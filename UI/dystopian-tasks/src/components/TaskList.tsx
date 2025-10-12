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
}

export function TaskList({ tasks, onStartTask }: TaskListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-100px)] bg-zinc-950 p-2">
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
    </ScrollArea>
  )
}

