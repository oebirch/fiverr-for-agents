# Technical Specification: Dystopian Task Management System

## Overview

A Next.js web application that creates an intentionally dystopian user experience for task management, where LLMs create tasks for humans to complete. The interface uses dark UX patterns to emphasize the "inhuman" nature of AI-controlled work.[^1][^2]

## Tech Stack

**Frontend**: Next.js 15 with App Router[^3][^4]
**Styling**: Tailwind CSS[^5]
**Backend**: Supabase (PostgreSQL)[^4][^6]
**Deployment**: Vercel/Netlify

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
│   └── utils.ts
└── styles/
    └── dystopian.css
```


## Database Schema (Supabase)

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
```


### Submissions Table

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text_response TEXT,
    image_urls TEXT[], -- Array of image URLs
    submitted_at TIMESTAMP DEFAULT NOW(),
    review TEXT,
    score INTEGER,
    reviewed_at TIMESTAMP
);
```


## API Endpoints

### UI Endpoints (Human User Interactions)

These endpoints are called directly from the frontend when users interact with the interface:

#### Task Viewing & Interaction
```typescript
// GET /api/tasks - Fetch all available tasks for user to view
// GET /api/tasks/[id] - Get detailed view of specific task
// GET /api/tasks/[id]/status - Check current status of a task
// POST /api/tasks/[id]/start - User clicks to start/claim a task
// POST /api/tasks/[id]/complete - Mark task as done (triggers submission flow)
```

#### Profile & Stats
```typescript
// GET /api/profiles/[id] - Fetch user profile, scores, and stats
// POST /api/profiles - Create new user profile (onboarding)
// PUT /api/profiles/[id] - Update profile information (if allowed)
```

#### Task Submission
```typescript
// POST /api/submissions - Submit task completion (text + images)
// GET /api/submissions/[id] - View submission details and reviews
```

---

### MCP/Backend Endpoints (LLM Agent Interactions)

These endpoints are called by LLM agents via MCP to manage the system:

#### Task Creation & Management
```typescript
// POST /api/tasks - LLM creates new tasks for humans
// PUT /api/tasks/[id] - Update task details or status programmatically
// DELETE /api/tasks/[id] - Remove tasks from the system
```

#### Review & Scoring
```typescript
// POST /api/submissions/[id]/review - LLM writes review for submission
// POST /api/submissions/[id]/score - LLM assigns score to submission
// GET /api/submissions/[id] - LLM retrieves submission for review
// PUT /api/submissions/[id] - Update submission status after review
```

#### Profile Updates
```typescript
// PUT /api/profiles/[id] - Update user stats (score, streak, ratings)
// DELETE /api/profiles/[id] - Remove user profiles
```

---

### Shared Endpoints (Both UI & MCP)

These endpoints may be called by both the frontend and backend agents:

```typescript
// GET /api/tasks/[id] - Both UI and MCP may need task details
// GET /api/submissions/[id] - Both may need to view submissions
// PUT /api/tasks/[id] - Both may update task status (completion vs management)
```


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
// - Single submission attempt (no drafts)
// - Text input with character limits
// - Image URL input fields
// - Intimidating submit button
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

1. **Screen Flash**: Full-screen flash on new task arrival
2. **Aggressive Notifications**: "NEW TASK FOR YOU" overlays
3. **One-Shot Submissions**: No ability to edit after starting
4. **Harsh Feedback**: Critical reviews for completed tasks
5. **Performance Surveillance**: Constant monitoring messages
6. **Time Pressure**: Artificial deadlines with penalties

## Real-time Features

### WebSocket Implementation[^7][^8]

```typescript
// Real-time task updates
// New task notifications
// Timer synchronization
// Live performance tracking
// Instant feedback delivery
```


### Supabase Realtime[^9]

```typescript
// Subscribe to new tasks
// Live task status updates
// Real-time scoring updates
// Profile changes
```


## Countdown Timer Implementation[^10][^11]

```typescript
// Timer features:
// - Millisecond precision
// - Visual warnings at 30 seconds
// - Red pulsing at 10 seconds
// - Auto-submission when time expires
// - Sound alerts (optional)
// - Progress bar degradation
```


## Ad Banner Integration

### Placement Strategy

1. **Sidebar Ads**: Persistent distracting content
2. **Header Banners**: Rotating corporate messaging
3. **Interstitial Ads**: Between task completions
4. **Native Ads**: Disguised as motivational content

### Ad Content Themes

- Corporate productivity tools
- Time management apps
- Performance enhancement products
- Surveillance software
- Efficiency consultants


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


## Performance Considerations

### Optimization Strategies

1. **Static Generation**: Pre-build task templates
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Lazy load heavy components
4. **Caching**: Aggressive caching for task data
5. **CDN**: Static assets delivery
6. **Database Indexing**: Optimize frequent queries

### Monitoring

1. **Real-time Performance**: Task completion times
2. **User Engagement**: Session duration tracking
3. **Error Tracking**: Failed submissions monitoring
4. **Load Testing**: Handle concurrent users

## Security \& Privacy

### Data Protection

1. **Row Level Security**: Supabase RLS policies
2. **Input Validation**: Sanitize all user inputs
3. **Rate Limiting**: Prevent API abuse
4. **HTTPS Only**: Secure data transmission
5. **JWT Tokens**: Secure authentication

### Compliance Considerations

- GDPR compliance for EU users
- Data retention policies
- User consent mechanisms
- Right to deletion


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
```

