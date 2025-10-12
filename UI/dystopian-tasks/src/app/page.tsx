'use client'

import { useState, useEffect } from 'react'
import { MotivationalBanner } from '@/components/MotivationalBanner'
import { TimerDisplay } from '@/components/TimerDisplay'
import { TaskList } from '@/components/TaskList'
import { TaskExecution } from '@/components/TaskExecution'
import { ProfilePanel } from '@/components/ProfilePanel'
import { NewTaskFlash } from '@/components/NewTaskFlash'
import { TaskCaptcha } from '@/components/TaskCaptcha'
import { useTaskPolling } from '@/hooks/useTaskPolling'
import { getPendingTasks, getProfile, getSubmissions, completeTask, PROFILE_ID } from '@/lib/api'

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [currentTask, setCurrentTask] = useState<any | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [timerActive, setTimerActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showTimeUpOverlay, setShowTimeUpOverlay] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null)
  
  // Callback to refresh tasks when poller detects new ones
  const refreshTasks = async () => {
    try {
      const tasksData = await getPendingTasks()
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to refresh tasks:', error)
    }
  }
  
  const { showFlash } = useTaskPolling(refreshTasks)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [tasksData, profileData, submissionsData] = await Promise.all([
          getPendingTasks(), // Get all pending tasks
          getProfile(PROFILE_ID),
          getSubmissions(PROFILE_ID, 10)
        ])
        setTasks(tasksData)
        setProfile(profileData)
        setSubmissions(submissionsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleStartTask = (taskId: string) => {
    // Show captcha before starting task
    setPendingTaskId(taskId)
    setShowCaptcha(true)
  }

  const handleCaptchaSuccess = () => {
    // Actually start the task after captcha is solved
    if (pendingTaskId) {
      const task = tasks.find(t => t.id === pendingTaskId)
      if (task) {
        setCurrentTask(task)
        setTimerActive(true)
      }
    }
    setShowCaptcha(false)
    setPendingTaskId(null)
  }

  const handleCaptchaClose = () => {
    setShowCaptcha(false)
    setPendingTaskId(null)
  }

  const handleSubmit = async (data: { taskId: string; textResponse: string; imageUrls: string[] }) => {
    try {
      await completeTask(data.taskId, data.textResponse, data.imageUrls, PROFILE_ID)
      setTimerActive(false)
      setCurrentTask(null)
      
      // Refresh tasks, submissions, and profile (to show tokens earned)
      const [tasksData, submissionsData, profileData] = await Promise.all([
        getPendingTasks(), // Get all pending tasks
        getSubmissions(PROFILE_ID, 10),
        getProfile(PROFILE_ID)
      ])
      setTasks(tasksData)
      setSubmissions(submissionsData)
      setProfile(profileData)
      
      alert('Task submitted! Awaiting review...')
    } catch (error) {
      console.error('Failed to submit task:', error)
      alert('Failed to submit task. Please try again.')
    }
  }

  const handlePurchaseTime = async (tokensSpent: number, timeAdded: number) => {
    // Update profile tokens locally (persists until page refresh)
    if (profile) {
      setProfile({
        ...profile,
        total_score: profile.total_score - tokensSpent
      })
    }
    // Note: Token deduction only persists in memory during this session
    // Backend would need a new endpoint to persist time purchases
  }

  const handleTimeUp = async () => {
    setTimerActive(false)
    setShowTimeUpOverlay(true)
    
    // Auto-submit task with empty/incomplete response
    if (currentTask) {
      try {
        // Submit with placeholder text indicating time ran out
        await completeTask(
          currentTask.id, 
          '[TIME EXPIRED - NO RESPONSE SUBMITTED]',
          [],
          PROFILE_ID
        )
        
        // Refresh tasks and submissions
        const [tasksData, submissionsData, profileData] = await Promise.all([
          getPendingTasks(),
          getSubmissions(PROFILE_ID, 10),
          getProfile(PROFILE_ID)
        ])
        setTasks(tasksData)
        setSubmissions(submissionsData)
        setProfile(profileData)
      } catch (error) {
        console.error('Failed to auto-submit task:', error)
      }
    }
    
    // Hide overlay after 2 seconds
    setTimeout(() => {
      setShowTimeUpOverlay(false)
      setCurrentTask(null)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 text-xl">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 text-xl">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header - Banner Only */}
      <div className="bg-zinc-950 border-b-2 border-zinc-800 py-2">
        <MotivationalBanner />
      </div>
      
      {/* Floating Timer - Only shows when task is active */}
      <TimerDisplay 
        maxTime={currentTask?.time_allowed_to_complete || 300}
        isActive={timerActive}
        onTimeUp={handleTimeUp}
        availableTokens={profile?.total_score || 0}
        onPurchaseTime={handlePurchaseTime}
      />
      
      {/* Main Layout - Desktop Only */}
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left Panel - 2 columns (narrow task list) */}
        <div className="col-span-2">
          <TaskList tasks={tasks} onStartTask={handleStartTask} />
        </div>
        
        {/* Middle Panel - 7 columns (WIDEST - main work area) */}
        <div className="col-span-7">
          <TaskExecution task={currentTask} onSubmit={handleSubmit} />
        </div>
        
        {/* Right Panel - 3 columns (profile and reviews) */}
        <div className="col-span-3">
          <ProfilePanel profile={profile} submissions={submissions} />
        </div>
      </div>
      
      {/* Flash Overlay */}
      <NewTaskFlash show={showFlash} onClose={() => {}} />
      
      {/* Time Up Overlay */}
      {showTimeUpOverlay && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <p className="text-white text-lg">
            you were too slow...
          </p>
        </div>
      )}
      
      {/* Captcha Modal */}
      <TaskCaptcha 
        isOpen={showCaptcha} 
        onSuccess={handleCaptchaSuccess}
        onClose={handleCaptchaClose}
      />
    </div>
  )
}

