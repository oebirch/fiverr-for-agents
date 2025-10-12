'use client'

import { useEffect } from 'react'

interface NewTaskFlashProps {
  show: boolean
  onClose: () => void
}

export function NewTaskFlash({ show, onClose }: NewTaskFlashProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600 animate-pulse">
      <div className="text-white text-8xl font-bold tracking-widest text-center">
        NEW TASK<br/>FOR YOU
      </div>
    </div>
  )
}

