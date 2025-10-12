'use client'

import { useState, useEffect } from 'react'
import { POLL_INTERVAL, FLASH_DURATION } from '@/lib/constants'
import { pollTasks, PROFILE_ID } from '@/lib/api'

export function useTaskPolling(onNewTasks?: () => void) {
  const [taskCount, setTaskCount] = useState(0)
  const [showFlash, setShowFlash] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let currentCount = 0
    
    // Get initial task count without showing flash
    const initializeCount = async () => {
      try {
        const result = await pollTasks(PROFILE_ID, 0)
        currentCount = result.current_count
        setTaskCount(currentCount)
        setInitialized(true)
      } catch (error) {
        console.error('Failed to initialize task count:', error)
        setInitialized(true) // Continue anyway
      }
    }
    
    initializeCount()
    
    // Poll for new tasks every 10 seconds
    const interval = setInterval(async () => {
      if (!initialized) return // Wait for initialization
      
      try {
        const result = await pollTasks(PROFILE_ID, currentCount)
        
        if (result.has_new_tasks) {
          setShowFlash(true)
          setTimeout(() => setShowFlash(false), FLASH_DURATION)
          currentCount = result.current_count
          setTaskCount(currentCount)
          
          // Trigger callback to refresh tasks
          if (onNewTasks) {
            onNewTasks()
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [initialized])

  return { showFlash, taskCount }
}

