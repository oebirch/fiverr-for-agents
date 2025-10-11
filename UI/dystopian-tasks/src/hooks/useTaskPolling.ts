'use client'

import { useState, useEffect } from 'react'
import { POLL_INTERVAL, FLASH_DURATION } from '@/lib/constants'
import { pollTasks, PROFILE_ID } from '@/lib/api'

export function useTaskPolling() {
  const [taskCount, setTaskCount] = useState(0)
  const [showFlash, setShowFlash] = useState(false)

  useEffect(() => {
    // Initial count
    let currentCount = 0
    
    // Poll for new tasks every 10 seconds
    const interval = setInterval(async () => {
      try {
        const result = await pollTasks(PROFILE_ID, currentCount)
        
        if (result.has_new_tasks) {
          setShowFlash(true)
          setTimeout(() => setShowFlash(false), FLASH_DURATION)
          currentCount = result.current_count
          setTaskCount(currentCount)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return { showFlash, taskCount }
}

