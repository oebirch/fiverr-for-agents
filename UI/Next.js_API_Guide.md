# Next.js API Implementation Guide with Supabase

## Overview

This guide outlines the **simplified implementation** of API endpoints for the Dystopian Task Management System using Next.js 15 App Router and Supabase client.

**⚠️ HACKATHON SIMPLIFICATIONS:**
- ❌ No user authentication (single hardcoded profile)
- ❌ No security/API keys (running locally only)
- ❌ No Row Level Security (RLS) policies
- ✅ Use polling instead of real-time subscriptions
- ❌ No rate limiting or advanced validation for demo
- ✅ MCP agents access Supabase directly via MCP Supabase tools (no custom API endpoints for LLMs)

## Setup

### Supabase Client Configuration

**File: `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase client for all operations (UI and server-side)
// No auth needed - using anon key for everything
// MCP agents will use Supabase MCP tools directly (not these API endpoints)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# No security needed - running locally only
# MCP agents will access Supabase directly via MCP Supabase tools
```

**File: `src/lib/constants.ts`**

```typescript
// Hardcoded values for hackathon demo
export const HARDCODED_PROFILE_ID = '00000000-0000-0000-0000-000000000001'
export const POLL_INTERVAL = 10000 // 10 seconds
export const FLASH_DURATION = 2000 // 2 seconds
```

---

## API Route Structure (Next.js 15 App Router)

**Note**: Only UI endpoints needed. MCP agents use Supabase MCP tools directly.

```
src/app/api/
├── tasks/
│   ├── route.ts                    # GET /api/tasks
│   └── [id]/
│       ├── route.ts                # GET /api/tasks/[id]
│       └── start/
│           └── route.ts            # POST /api/tasks/[id]/start
├── profiles/
│   └── [id]/
│       └── route.ts                # GET /api/profiles/[id]
└── submissions/
    └── route.ts                    # GET /api/submissions, POST /api/submissions
```

---

## Authentication & Authorization

**⚠️ HACKATHON SIMPLIFICATION**: No authentication needed at all!

All endpoints are open for local development. No auth checks required.

---

## UI Endpoints Implementation

### 1. Get All Tasks

**File: `src/app/api/tasks/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch all pending tasks
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 2. Get Specific Task

**File: `src/app/api/tasks/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching task:', error)
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 3. Start Task (User Claims Task)

**File: `src/app/api/tasks/[id]/start/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Update task status to 'in_progress' and assign timestamp
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        status: 'in_progress',
        assigned_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('status', 'pending') // Only start if still pending
      .select()
      .single()

    if (error) {
      console.error('Error starting task:', error)
      return NextResponse.json(
        { error: 'Failed to start task' },
        { status: 400 }
      )
    }

    return NextResponse.json({ task, message: 'Task started successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 4. Get User Profile

**File: `src/app/api/profiles/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 5. Submit Task Completion

**File: `src/app/api/submissions/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { HARDCODED_PROFILE_ID } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const { taskId, textResponse, imageUrls } = await request.json()

    // Validate required fields
    if (!taskId || !textResponse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create submission using hardcoded profile ID
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        profile_id: HARDCODED_PROFILE_ID, // Hardcoded for hackathon
        text_response: textResponse,
        image_urls: imageUrls || [],
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Error creating submission:', submissionError)
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      )
    }

    // Update task status to 'submitted'
    const { error: taskError } = await supabase
      .from('tasks')
      .update({
        status: 'submitted',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (taskError) {
      console.error('Error updating task:', taskError)
    }

    return NextResponse.json({
      submission,
      message: 'Submission created successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 6. Get Submissions (for displaying reviews)

**File: `src/app/api/submissions/route.ts`** (add GET method)

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId') || HARDCODED_PROFILE_ID

    // Fetch submissions with reviews for the profile
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        *,
        tasks (
          title,
          description
        )
      `)
      .eq('profile_id', profileId)
      .order('submitted_at', { ascending: false })
      .limit(10) // Show last 10 submissions

    if (error) {
      console.error('Error fetching submissions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Error Handling Patterns

### Standardized Error Response

```typescript
type ErrorResponse = {
  error: string
  details?: any
  timestamp: string
}

export function createErrorResponse(
  error: string,
  status: number,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error,
      details,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}
```

### Usage Example

```typescript
import { createErrorResponse } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    // ... your code
  } catch (error) {
    console.error('Unexpected error:', error)
    return createErrorResponse(
      'Internal server error',
      500,
      { originalError: error.message }
    )
  }
}
```

---

## Database Query Patterns

### 1. Fetch with Relationships

```typescript
// Fetch task with related submission
const { data, error } = await supabase
  .from('tasks')
  .select(`
    *,
    submissions (
      id,
      text_response,
      score,
      review
    )
  `)
  .eq('id', taskId)
  .single()
```

### 2. Filtered Queries

```typescript
// Get tasks by status with pagination
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
  .range(0, 9) // First 10 results
```

### 3. Counting Records

```typescript
// Count pending tasks
const { count, error } = await supabase
  .from('tasks')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
```

---

## Polling for New Tasks (Client-Side)

**⚠️ HACKATHON SIMPLIFICATION**: Use polling instead of real-time subscriptions for faster implementation.

### Poll for New Tasks

**File: `src/hooks/useTaskPolling.ts`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { POLL_INTERVAL, FLASH_DURATION } from '@/lib/constants'

export function useTaskPolling() {
  const [taskCount, setTaskCount] = useState(0)
  const [showFlash, setShowFlash] = useState(false)

  useEffect(() => {
    // Initial fetch
    const fetchTaskCount = async () => {
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      
      if (count !== null && count > taskCount) {
        // New task detected!
        setShowFlash(true)
        setTimeout(() => setShowFlash(false), FLASH_DURATION)
      }
      
      if (count !== null) {
        setTaskCount(count)
      }
    }

    fetchTaskCount() // Initial call

    // Poll every 10 seconds
    const interval = setInterval(fetchTaskCount, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [taskCount])

  return { showFlash, taskCount }
}
```

### Flash Overlay Component

**File: `src/components/ui/NewTaskFlash.tsx`**

```typescript
export function NewTaskFlash({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600 animate-pulse">
      <div className="text-white text-6xl font-bold tracking-widest">
        NEW TASK FOR YOU
      </div>
    </div>
  )
}
```

---

## Testing API Endpoints

### Example cURL Commands

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Get specific task
curl http://localhost:3000/api/tasks/[task-id]

# Start task
curl -X POST http://localhost:3000/api/tasks/[task-id]/start \
  -H "Content-Type: application/json"

# Get user profile
curl http://localhost:3000/api/profiles/00000000-0000-0000-0000-000000000001

# Submit task
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task-id",
    "textResponse": "Survey completed",
    "imageUrls": ["https://example.com/screenshot.png"]
  }'

# Get submissions (to see reviews)
curl "http://localhost:3000/api/submissions?profileId=00000000-0000-0000-0000-000000000001"
```

### MCP Agent Operations

**Note**: MCP agents don't use these API endpoints. They use Supabase MCP tools directly:

```typescript
// MCP agents will use these Supabase MCP tools:
// - mcp_supabase_execute_sql - To create tasks, add reviews, update profiles
// - mcp_supabase_list_tables - To inspect database schema
// - mcp_supabase_apply_migration - For any schema changes

// Example: LLM creates a task via MCP
await mcp_supabase_execute_sql({
  query: `
    INSERT INTO tasks (title, description, objective, success_criteria, max_time_seconds, status)
    VALUES ('Complete survey', 'Fill out form', 'Gather feedback', 'All answered', 300, 'pending')
  `
})

// Example: LLM adds review via MCP
await mcp_supabase_execute_sql({
  query: `
    UPDATE submissions 
    SET review = 'Good work but needs improvement', 
        score = 75, 
        reviewed_at = NOW()
    WHERE id = 'submission-id'
  `
})
```

---

## Best Practices for Hackathon

### 1. Use Server Components When Possible
- Fetch data in Server Components to reduce client-side JavaScript
- Use API routes only when necessary (forms, mutations, MCP access)

### 2. Basic Error Logging
```typescript
// Add console logging for debugging
console.log(JSON.stringify({
  level: 'info',
  message: 'Task created',
  taskId: task.id,
  timestamp: new Date().toISOString()
}))
```

### 3. Simple Input Validation
```typescript
// Basic validation without external libraries
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  if (!body.title || body.title.length === 0) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    )
  }
  
  // ... proceed with data
}
```

---

## ❌ Out of Scope for Hackathon

The following are **explicitly removed** to save 15-20 hours:

1. ❌ **Row Level Security (RLS)** - No Supabase RLS policies
2. ❌ **User Authentication** - Single hardcoded profile only
3. ❌ **API Security** - No API keys, no authentication
4. ❌ **MCP Custom Endpoints** - MCP uses Supabase tools directly
5. ❌ **Rate Limiting** - Not needed for demo
6. ❌ **Advanced Input Validation** - Basic checks only
7. ❌ **Error Tracking Services** - Console logs only
8. ❌ **API Monitoring** - Not needed for local demo
9. ❌ **Automated Tests** - Manual testing only
10. ❌ **OpenAPI Documentation** - Skip for hackathon
11. ❌ **Production Deployment** - Local development only

---

## Quick Start Checklist

1. ✅ Create Next.js project with TypeScript and Tailwind
2. ✅ Install `@supabase/supabase-js`
3. ✅ Set up Supabase project and create tables
4. ✅ Insert hardcoded profile into database
5. ✅ Create `.env.local` with Supabase URL and anon key (no security needed)
6. ✅ Create `lib/supabase.ts` and `lib/constants.ts`
7. ✅ Build UI API routes (tasks, profiles, submissions)
8. ✅ Test with cURL commands
9. ✅ Implement polling hook for new tasks
10. ✅ Set up MCP Supabase tools for LLM agent access
11. ✅ Focus on dystopian UX polish

## MCP Agent Setup

For LLM agents to interact with the database:

1. **Configure Supabase MCP Server** in your MCP settings
2. **Provide Supabase credentials** to MCP (URL + anon key)
3. **LLM agents can now**:
   - Create tasks using `mcp_supabase_execute_sql`
   - Add reviews and scores to submissions
   - Update profile statistics
   - Query any data they need

No custom API endpoints needed for MCP!

