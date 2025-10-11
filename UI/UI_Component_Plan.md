# Dystopian Task Management - UI Component Plan (shadcn-ui)

## Overview

This document maps the dystopian task management interface to **shadcn-ui components only**. No custom components will be built - everything uses pre-built shadcn-ui components with Tailwind styling.

**shadcn-ui Installation:**
```bash
npx shadcn-ui@latest init
```

---

## Required shadcn-ui Components

Install these components from shadcn-ui:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add skeleton
```

---

## Layout Structure

### Main Page Layout (Responsive Grid)

```
Desktop View (Desktop Only - No Mobile):
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ EFFICIENCY IS EVERYTHING • YOUR TASKS AWAIT • PERFORMANCE UNDER...        │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ Timer: 05:00 ■■■■■■■■■■■■■■■■░░░░ 83%                                    │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
├───────────┬───────────────────────────────────────────────────┬───────────────┤
│           │                                                   │               │
│  LEFT     │              MIDDLE PANEL                         │  RIGHT        │
│  PANEL    │            (WIDEST SECTION)                       │  PANEL        │
│           │                                                   │               │
│  Task     │  ┌─────────────────────────────────────────────┐ │  Profile      │
│  Cards    │  │ Current Task: "Complete Survey"             │ │  Stats        │
│  (List)   │  │                                             │ │               │
│           │  │ Description: ...                            │ │  ┌─────────┐  │
│  ┌─────┐  │  │ Objective: ...                              │ │  │Total    │  │
│  │Task │  │  │ Success Criteria: ...                       │ │  │Score:   │  │
│  │  #1 │  │  │                                             │ │  │ 875     │  │
│  │START│  │  │                                             │ │  └─────────┘  │
│  └─────┘  │  │                                             │ │               │
│           │  │ TEXT RESPONSE:                              │ │  Reviews:     │
│  ┌─────┐  │  │ ┌─────────────────────────────────────────┐ │ │  ┌─────────┐  │
│  │Task │  │  │ │ [Large textarea for response]           │ │ │  │"Good    │  │
│  │  #2 │  │  │ │                                         │ │ │  │ work"   │  │
│  │START│  │  │ │                                         │ │ │  │ ★★★★☆   │  │
│  └─────┘  │  │ │                                         │ │ │  └─────────┘  │
│           │  │ └─────────────────────────────────────────┘ │ │               │
│  ┌─────┐  │  │                                             │ │  ┌─────────┐  │
│  │Task │  │  │ IMAGE URLS:                                 │ │  │ [AD]    │  │
│  │  #3 │  │  │ https://...                                 │ │  │ BOOST   │  │
│  │START│  │  │ https://...                                 │ │  │ SPEED   │  │
│  └─────┘  │  │                                             │ │  └─────────┘  │
│           │  │ ┌─────────────────────────────────────────┐ │ │               │
│           │  │ │         SUBMIT WORK                     │ │ │  ┌─────────┐  │
│           │  │ └─────────────────────────────────────────┘ │ │  │"Needs   │  │
│           │  └─────────────────────────────────────────────┘ │  │ improve"│  │
│           │                                                   │  │ ★★☆☆☆   │  │
│           │                                                   │  └─────────┘  │
│  2 cols   │                 7 cols                            │   3 cols      │
│  (16.7%)  │                (58.3%)                            │   (25%)       │
└───────────┴───────────────────────────────────────────────────┴───────────────┘

Grid Proportions:
- Left Panel:   2 cols (16.7%) - Narrow scrollable task list
- Middle Panel: 7 cols (58.3%) - WIDEST - Main work area  
- Right Panel:  3 cols (25%)   - Profile and 5-star reviews
```

---

## Component Mapping by Section

### 1. Header Components

#### Motivational Banner (Scrolling Text)

**shadcn-ui Components:**
- None needed - use pure CSS animation with Tailwind

**Implementation:**
```tsx
<div className="bg-red-950 border-b border-red-900 overflow-hidden">
  <div className="animate-marquee whitespace-nowrap py-2 text-red-200 text-sm font-mono">
    EFFICIENCY IS EVERYTHING • YOUR TASKS AWAIT COMPLETION • PERFORMANCE UNDER SURVEILLANCE
  </div>
</div>
```

**Tailwind Config (add to globals.css):**
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

#### Countdown Timer

**shadcn-ui Components:**
- **Progress** - For time remaining bar
- **Badge** - For time display

**Implementation:**
```tsx
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

<div className="bg-zinc-950 p-4 flex items-center justify-between">
  <Badge variant="destructive" className="text-2xl px-6 py-2">
    {formatTime(timeLeft)} {/* MM:SS */}
  </Badge>
  <Progress 
    value={(timeLeft / maxTime) * 100} 
    className="w-64 h-2"
  />
</div>
```

---

### 2. Left Panel - Task List (Narrow Column)

**shadcn-ui Components:**
- **Card** (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Badge** - For status indicators
- **Button** - For "Start Task" action
- **ScrollArea** - For scrollable task list

**Implementation (Compact Design):**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-[calc(100vh-180px)] bg-zinc-950 p-2">
  {tasks.map(task => (
    <Card 
      key={task.id} 
      className="mb-3 border-red-900 bg-zinc-900 hover:border-red-500 transition-colors"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-100 line-clamp-2">
          {task.title}
        </CardTitle>
        <Badge 
          variant="destructive" 
          className="w-fit text-xs animate-pulse mt-1"
        >
          URGENT
        </Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-xs text-zinc-500">
          ⏱ {task.max_time_seconds / 60}min
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full text-xs"
          onClick={() => startTask(task.id)}
        >
          START
        </Button>
      </CardFooter>
    </Card>
  ))}
</ScrollArea>
```

**Note:** Compact design for narrow column - smaller text, tighter spacing

**Dystopian Styling:**
- Red pulsing borders for urgency
- Dark background (`bg-zinc-900`, `bg-zinc-950`)
- Destructive red accents
- Monospace fonts for "terminal" feel

---

### 3. Middle Panel - Task Execution (WIDEST SECTION - 58.3%)

**shadcn-ui Components:**
- **Card** - Container for task details
- **Textarea** - For text response
- **Input** - For image URL inputs
- **Button** - For submit action
- **Alert** - For warnings/instructions
- **Separator** - Between sections

**Implementation (Spacious Design):**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

<div className="h-screen bg-zinc-900 p-4 overflow-y-auto">
  <Card className="bg-zinc-950 border-red-900">
    <CardHeader>
      <CardTitle className="text-red-100 text-2xl">
        {currentTask.title}
      </CardTitle>
    </CardHeader>
    
    <CardContent className="space-y-6">
      {/* Task Description */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">DESCRIPTION</h3>
        <p className="text-zinc-300">{currentTask.description}</p>
      </div>
      
      <Separator className="bg-red-900" />
      
      {/* Objective */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">OBJECTIVE</h3>
        <p className="text-zinc-300">{currentTask.objective}</p>
      </div>
      
      <Separator className="bg-red-900" />
      
      {/* Success Criteria */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">SUCCESS CRITERIA</h3>
        <p className="text-zinc-300">{currentTask.success_criteria}</p>
      </div>
      
      <Separator className="bg-red-900" />
      
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
```

---

### 4. Right Panel - Profile & Performance

**shadcn-ui Components:**
- **Card** - For profile stats
- **Badge** - For metrics
- **ScrollArea** - For scrollable reviews
- **Separator** - Between sections

**Implementation (5-Star Rating System):**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Helper function to render stars
const renderStars = (rating: number) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-yellow-500" : "text-zinc-600"}>
        ★
      </span>
    )
  }
  return stars
}

<ScrollArea className="h-[calc(100vh-180px)] bg-zinc-950 p-4">
  {/* Profile Stats Card */}
  <Card className="mb-4 bg-zinc-900 border-red-900">
    <CardHeader>
      <CardTitle className="text-red-100">
        WORKER #{profile.user_name}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-500">TOTAL SCORE</p>
          <p className="text-2xl font-bold text-red-400">{profile.total_score}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">AVG RATING</p>
          <div className="text-lg">
            {renderStars(Math.round(profile.average_rating))}
          </div>
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
  
  <Separator className="my-4 bg-red-900" />
  
  {/* Ad Banner Placeholder */}
  <Card className="mb-4 bg-red-950 border-red-500">
    <CardContent className="p-4 text-center">
      <p className="text-red-200 text-xs font-bold">
        INCREASE YOUR EFFICIENCY BY 300%
      </p>
      <p className="text-red-400 text-xs">
        BUY SURVEILLANCE TOOLS NOW
      </p>
    </CardContent>
  </Card>
  
  <Separator className="my-4 bg-red-900" />
  
  {/* Previous Reviews (5-Star System) */}
  <Card className="bg-zinc-900 border-red-900">
    <CardHeader>
      <CardTitle className="text-red-100 text-sm">
        PERFORMANCE REVIEWS
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {submissions.map(submission => (
          <div key={submission.id} className="border-l-2 border-red-900 pl-3">
            <p className="text-xs text-zinc-500 mb-1">
              {submission.tasks.title}
            </p>
            <div className="mb-2 text-lg">
              {renderStars(submission.rating)} {/* 1-5 stars */}
            </div>
            <p className="text-sm text-zinc-400 italic">
              "{submission.review}"
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              {new Date(submission.submitted_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</ScrollArea>
```

**Note:** Reviews now use 1-5 star rating system (★★★★★) instead of 0-100 scores

---

### 5. "NEW TASK FOR YOU" Flash Overlay

**shadcn-ui Components:**
- None (simple div overlay - no Dialog component needed)

**Implementation:**
```tsx
// Simple full-screen overlay without Dialog component
{showFlash && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600 animate-pulse">
    <div className="text-white text-8xl font-bold tracking-widest text-center">
      NEW TASK<br/>FOR YOU
    </div>
  </div>
)}

// Auto-dismiss after 2 seconds
useEffect(() => {
  if (showFlash) {
    const timer = setTimeout(() => setShowFlash(false), 2000)
    return () => clearTimeout(timer)
  }
}, [showFlash])
```

**Note:** Using simple div instead of Dialog component to avoid accessibility conflicts and ensure proper auto-dismiss

---

## Color Scheme (Tailwind Classes)

### Background Colors
- `bg-zinc-950` - Darkest background
- `bg-zinc-900` - Card backgrounds
- `bg-red-950` - Destructive/warning sections
- `bg-red-600` - Flash overlay

### Text Colors
- `text-zinc-100` - Primary text
- `text-zinc-400` - Secondary text
- `text-zinc-500` - Tertiary/labels
- `text-red-100` - Headers
- `text-red-400` - Accent text

### Border Colors
- `border-zinc-700` - Default borders
- `border-red-900` - Accent borders
- `border-red-500` - Active/hover states

### Badge Variants
- `variant="destructive"` - Red badges (urgent, warnings)
- `variant="outline"` - Subtle badges
- `variant="default"` - Standard badges

### Button Variants
- `variant="destructive"` - Primary action buttons (red)
- `variant="outline"` - Secondary actions
- `variant="ghost"` - Tertiary actions

---

## Page Component Structure

### Main Page (`app/page.tsx`)

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// ... other imports

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [currentTask, setCurrentTask] = useState(null)
  const [profile, setProfile] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [showFlash, setShowFlash] = useState(false)
  
  // Use polling hook
  const { showFlash: newTaskDetected } = useTaskPolling()
  
  useEffect(() => {
    if (newTaskDetected) setShowFlash(true)
  }, [newTaskDetected])
  
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <MotivationalBanner />
      <TimerDisplay />
      
      {/* Main Layout - Middle panel is widest (Desktop Only) */}
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left Panel - 2 columns (narrow task list) */}
        <div className="col-span-2">
          <TaskList tasks={tasks} onStartTask={handleStartTask} />
        </div>
        
        {/* Middle Panel - 7 columns (WIDEST - main work area) */}
        <div className="col-span-7">
          <TaskExecution task={currentTask} />
        </div>
        
        {/* Right Panel - 3 columns (profile and reviews) */}
        <div className="col-span-3">
          <ProfilePanel profile={profile} submissions={submissions} />
        </div>
      </div>
      
      {/* Flash Overlay */}
      <NewTaskFlash show={showFlash} onClose={() => setShowFlash(false)} />
    </div>
  )
}
```

---

## Component Files to Create

Using shadcn-ui components, create these wrapper components:

### 1. `components/MotivationalBanner.tsx`
- Pure CSS/Tailwind - no shadcn component needed

### 2. `components/TimerDisplay.tsx`
- Uses: `Badge`, `Progress`

### 3. `components/TaskList.tsx`
- Uses: `Card`, `Badge`, `Button`, `ScrollArea`

### 4. `components/TaskExecution.tsx`
- Uses: `Card`, `Input`, `Textarea`, `Button`, `Alert`, `Separator`

### 5. `components/ProfilePanel.tsx`
- Uses: `Card`, `Badge`, `ScrollArea`, `Separator`

### 6. `components/NewTaskFlash.tsx`
- Uses: `Dialog`

### 7. `hooks/useTaskPolling.ts`
- Custom hook for polling (no UI component)

---

## Installation Checklist

```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest dystopian-tasks --typescript --tailwind --app

# Initialize shadcn-ui
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add skeleton

# Install Supabase
npm install @supabase/supabase-js
```

---

## Key Benefits of This Approach

1. ✅ **No Custom Components** - All UI from shadcn-ui
2. ✅ **Consistent Design** - shadcn-ui handles accessibility and interactions
3. ✅ **Fast Development** - Just compose pre-built components
4. ✅ **Easy Styling** - Tailwind classes for dystopian theme
5. ✅ **Type-Safe** - TypeScript throughout
6. ✅ **Responsive** - shadcn-ui components are mobile-friendly
7. ✅ **Maintainable** - Standard component library

---

## Next Steps

1. Set up Next.js project
2. Initialize shadcn-ui
3. Install all required components
4. Create wrapper components (TaskList, TaskExecution, ProfilePanel)
5. Implement page layout with grid
6. Add Tailwind dystopian styling
7. Connect to Supabase API routes
8. Test polling and flash overlay

**Estimated Time:** 8-10 hours with shadcn-ui components (vs 15-20 hours custom)

