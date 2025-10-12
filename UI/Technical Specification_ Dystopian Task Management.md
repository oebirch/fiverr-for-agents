# Technical Specification: Dystopian Task Management System

## Overview

A Next.js web application that creates an intentionally dystopian user experience for task management, where LLMs create tasks for humans to complete. The interface uses dark UX patterns to emphasize the "inhuman" nature of AI-controlled work.[^1][^2]

## Tech Stack

**Frontend**: Next.js 15 with App Router[^3][^4]
**Styling**: Tailwind CSS (inline classes only)[^5]
**Backend**: Supabase (PostgreSQL)[^4][^6]
**Deployment**: Local development only (no production deployment for hackathon)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── tasks/
├── components/
│   ├── ui/
│   │   ├── TaskCard.tsx
│   │   ├── Timer.tsx
│   │   ├── MotivationalBanner.tsx
│   │   └── AdBanner.tsx
│   ├── forms/
│   │   └── TaskSubmission.tsx
│   └── layout/
│       ├── LeftPanel.tsx
│       ├── MiddlePanel.tsx
│       └── RightPanel.tsx
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── constants.ts        # Hardcoded profile UUID, config
└── hooks/
    └── useTaskPolling.ts    # Polling for new tasks
```


## Database Schema (Supabase)

**⚠️ HACKATHON SIMPLIFICATION**: No authentication, no RLS policies. Use Supabase anon key for all operations.

### Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    objective TEXT NOT NULL,
    success_criteria TEXT NOT NULL,
    max_time_seconds INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP
);
```


### Profiles Table

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(100) NOT NULL,
    total_score INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    streak_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create single demo profile for hackathon
INSERT INTO profiles (id, user_name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Human Worker #1847');
```


### Submissions Table

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text_response TEXT NOT NULL,
    image_urls TEXT[], -- Array of image URLs (pasted as text by user)
    submitted_at TIMESTAMP DEFAULT NOW(),
    review TEXT,
    score INTEGER,
    reviewed_at TIMESTAMP
);
```


## API Endpoints (UI Only)

**⚠️ HACKATHON SIMPLIFICATION**: MCP agents will interact directly with Supabase database via MCP Supabase tools. No custom API endpoints needed for LLM agents.

### UI Endpoints

These endpoints are called directly from the frontend when users interact with the interface:

#### Task Viewing & Interaction
```typescript
// GET /api/tasks - Fetch all available tasks for user to view
// GET /api/tasks/[id] - Get detailed view of specific task
// POST /api/tasks/[id]/start - User clicks to start/claim a task
```

#### Profile & Stats
```typescript
// GET /api/profiles/[id] - Fetch user profile, scores, and stats
```

#### Task Submission
```typescript
// POST /api/submissions - Submit task completion (text + image URLs)
// GET /api/submissions - Get submissions for user profile (to show reviews)
```

**Note**: MCP agents will use Supabase MCP tools to:
- Create tasks directly in database
- Add reviews and scores to submissions
- Update profile stats
- No custom API endpoints required for LLM interactions


## UI Components

### Left Panel - Task List

```typescript
// TaskCard component features:
// - Dark themed card design
// - Urgency indicators (pulsing red borders)
// - Time pressure indicators
// - Ominous task descriptions
// - One-click task starting
```


### Middle Panel - Task Execution

```typescript
// TaskForm component:
// - Countdown timer with red warning states
// - Can edit text during timer countdown
// - Single submission attempt (button works ONCE only)
// - Text input with character limits
// - Image URL input fields (simple text inputs - users paste URLs)
//   Example: "Paste image URL (must be publicly accessible)"
// - Intimidating submit button ("SUBMIT WORK" - one chance only)
// - Auto-submit when timer reaches 0
// - Progress loss warnings
```


### Right Panel - Profile \& Performance

```typescript
// Profile display:
// - Score tracking with harsh judgments
// - Previous task reviews (often critical)
// - Performance metrics
// - "Efficiency" ratings
// - Streak counters
```


### Header Components

```typescript
// Timer component with anxiety-inducing features:
// - Red countdown timer
// - Audio alerts (optional)
// - Screen flash warnings

// MotivationalBanner component:
// - Scrolling text with corporate dystopian messages
// - "EFFICIENCY IS EVERYTHING"
// - "YOUR TASKS AWAIT COMPLETION"
// - "PERFORMANCE UNDER SURVEILLANCE"
```


## Dystopian UX Features[^2][^1]

### Dark Patterns Implementation

1. **Forced Continuity**: Tasks auto-assign when viewing
2. **Pressure Tactics**: Countdown timers create artificial urgency
3. **Loss Aversion**: Progress warnings and streak counters
4. **Social Proof Manipulation**: Fake "other users completing tasks" notifications
5. **Bait and Switch**: Easy task preview, difficult execution
6. **Roach Motel**: Easy to start tasks, pressure to complete

### "Inhuman" Features

1. **Screen Flash**: Full-screen overlay modal on new task arrival
   - "NEW TASK FOR YOU" in large text
   - Auto-dismiss after 2 seconds
   - Bright flash animation
2. **Aggressive Notifications**: Overlay covers entire screen
3. **One-Shot Submissions**: Can edit while timer runs, but submit button works ONCE
4. **Harsh Feedback**: Critical reviews for completed tasks
5. **Performance Surveillance**: Constant monitoring messages
6. **Time Pressure**: Countdown timer with auto-submit at 0

## New Task Detection (Polling Approach)

**⚠️ HACKATHON SIMPLIFICATION**: Use simple polling instead of WebSocket/Realtime for speed.

### Polling Implementation

```typescript
// hooks/useTaskPolling.ts
// Poll for new tasks every 10 seconds
// Compare task count with previous count
// Trigger "NEW TASK FOR YOU" flash when new task detected
// Simple setInterval approach

export function useTaskPolling() {
  const [taskCount, setTaskCount] = useState(0)
  const [showFlash, setShowFlash] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      
      if (count > taskCount) {
        setShowFlash(true) // Trigger flash overlay
        setTimeout(() => setShowFlash(false), 2000)
      }
      setTaskCount(count)
    }, 10000) // Poll every 10 seconds
    
    return () => clearInterval(interval)
  }, [taskCount])
  
  return { showFlash }
}
```


## Countdown Timer Implementation

```typescript
// Timer features:
// - Second-level precision (good enough for demo)
// - Visual warnings at 30 seconds (yellow)
// - Red pulsing at 10 seconds
// - Auto-submission when time reaches 0
// - Sound alerts (nice-to-have, optional)
// - Progress bar that depletes (not fills)

// components/ui/Timer.tsx
export function Timer({ maxTimeSeconds, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(maxTimeSeconds)
  
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp() // Trigger auto-submit
      return
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])
  
  const warningState = timeLeft <= 10 ? 'critical' : timeLeft <= 30 ? 'warning' : 'normal'
  
  return (
    <div className={`timer ${warningState}`}>
      {formatTime(timeLeft)}
    </div>
  )
}
```


## Ad Banner Integration

**⚠️ HACKATHON SIMPLIFICATION**: Use static placeholder images only.

### Placement Strategy

1. **Sidebar Ads**: Static images in right panel
2. **Between sections**: Small banner placeholders

### Implementation

```typescript
// Use placeholder images or simple divs with dystopian text
<div className="ad-banner bg-zinc-800 p-4 text-xs">
  <p>INCREASE YOUR EFFICIENCY BY 300%</p>
  <p className="text-red-500">BUY SURVEILLANCE TOOLS NOW</p>
</div>

// Or use placeholder image services
<img src="https://placehold.co/300x250/1a1a1a/ff3333?text=PRODUCTIVITY+APP" />
```

### Ad Content Themes

- Corporate productivity tools
- Time management apps
- Performance enhancement products
- Surveillance software


## Styling Approach

### Dystopian Color Palette

```css
:root {
  --primary-bg: #0a0a0a;
  --secondary-bg: #1a1a1a;
  --accent-red: #ff3333;
  --warning-orange: #ff6b35;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-dark: #333333;
  --success-green: #00ff88;
}
```


### Key Visual Elements

- **High contrast** for eye strain
- **Sharp, angular** components
- **Red warning states** throughout
- **Monospace fonts** for "terminal" feel
- **Subtle animations** that create unease
- **Progress bars** that deplete rather than fill


## ❌ OUT OF SCOPE FOR HACKATHON

### Explicitly Removed for 2-Day Timeline

1. ❌ **Authentication/User Management**: Single hardcoded profile UUID
2. ❌ **Row Level Security (RLS)**: No security policies
3. ❌ **WebSocket/Real-time**: Using polling instead
4. ❌ **Production Deployment**: Local development only
5. ❌ **Performance Optimization**: Default Next.js settings
6. ❌ **Security Hardening**: Demo app, no real user data
7. ❌ **GDPR Compliance**: Not applicable for demo
8. ❌ **Rate Limiting**: Skip for hackathon
9. ❌ **Load Testing**: Not needed for demo
10. ❌ **Multiple User Profiles**: One hardcoded profile only

### Time Saved: ~15-20 hours

Focus exclusively on visual dystopian impact and core task workflow.


## Development Workflow

### Environment Setup

```bash
npx create-next-app@latest dystopian-tasks --typescript --tailwind
cd dystopian-tasks
npm install @supabase/supabase-js
npm install lucide-react # For icons
```


### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# No security needed - running locally only
# MCP agents access Supabase directly via MCP Supabase tools
```

### Hardcoded Constants

```typescript
// lib/constants.ts
export const HARDCODED_PROFILE_ID = '00000000-0000-0000-0000-000000000001'
export const POLL_INTERVAL = 10000 // 10 seconds
export const FLASH_DURATION = 2000 // 2 seconds
```

