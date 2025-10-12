'use client'

import { MOTIVATIONAL_MESSAGES } from '@/lib/constants'

export function MotivationalBanner() {
  const messages = MOTIVATIONAL_MESSAGES.join(' • ')
  
  return (
    <div className="overflow-hidden">
      <div className="animate-marquee whitespace-nowrap py-2 text-zinc-400 text-sm font-mono uppercase">
        {messages} • {messages} • {messages}
      </div>
    </div>
  )
}

