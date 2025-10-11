// Hardcoded values for hackathon demo
export const HARDCODED_PROFILE_ID = '00000000-0000-0000-0000-000000000001'
export const POLL_INTERVAL = 10000 // 10 seconds
export const FLASH_DURATION = 2000 // 2 seconds

// Mock data for development - using static dates to avoid hydration errors
export const MOCK_TASKS = [
  {
    id: '1',
    title: 'Complete Customer Satisfaction Survey',
    body: 'Fill out the detailed customer feedback form for Q4 performance metrics. Provide comprehensive responses to all required fields.',
    time_allowed_to_complete: 300,
    status: 'pending',
    time_submitted: '2024-10-11T12:00:00.000Z'
  },
  {
    id: '2',
    title: 'Data Entry: Product Catalog Update',
    body: 'Enter 50 product descriptions into the database system. Ensure all products have correct SKU numbers and accurate pricing information.',
    time_allowed_to_complete: 600,
    status: 'pending',
    time_submitted: '2024-10-11T12:00:00.000Z'
  },
  {
    id: '3',
    title: 'Content Moderation Review',
    body: 'Review and categorize 100 user-generated content items according to platform compliance guidelines. Flag any violations.',
    time_allowed_to_complete: 900,
    status: 'pending',
    time_submitted: '2024-10-11T12:00:00.000Z'
  }
]

export const MOCK_PROFILE = {
  id: HARDCODED_PROFILE_ID,
  user_name: 'Human Worker #1847',
  total_score: 875,
  tasks_completed: 23,
  average_rating: 7.6, // Out of 10
  streak_count: 7,
  created_at: '2024-10-01T12:00:00.000Z',
  updated_at: '2024-10-11T12:00:00.000Z'
}

export const MOCK_SUBMISSIONS = [
  {
    id: '1',
    task_id: '1',
    profile_id: HARDCODED_PROFILE_ID,
    text_response: 'Completed the survey with detailed feedback',
    image_urls: [],
    submitted_at: '2024-10-10T12:00:00.000Z', // 1 day ago
    review: 'Good work, but could have provided more specific examples in sections 3 and 4.',
    rating: 8,
    reviewed_at: '2024-10-10T13:00:00.000Z',
    tasks: {
      title: 'Complete Customer Satisfaction Survey',
      description: 'Fill out the detailed customer feedback form'
    }
  },
  {
    id: '2',
    task_id: '2',
    profile_id: HARDCODED_PROFILE_ID,
    text_response: 'All data entries completed as requested',
    image_urls: ['https://placehold.co/600x400/1a1a1a/ff3333?text=Screenshot'],
    submitted_at: '2024-10-09T12:00:00.000Z', // 2 days ago
    review: 'Needs improvement. Several entries had formatting errors that required correction.',
    rating: 4,
    reviewed_at: '2024-10-09T13:00:00.000Z',
    tasks: {
      title: 'Data Entry: Product Catalog Update',
      description: 'Enter 50 product descriptions'
    }
  },
  {
    id: '3',
    task_id: '3',
    profile_id: HARDCODED_PROFILE_ID,
    text_response: 'Reviewed and categorized all content items according to guidelines',
    image_urls: [],
    submitted_at: '2024-10-08T12:00:00.000Z', // 3 days ago
    review: 'Excellent work. All categorizations were accurate and well-documented.',
    rating: 10,
    reviewed_at: '2024-10-08T13:00:00.000Z',
    tasks: {
      title: 'Content Moderation Review',
      description: 'Review and categorize user content'
    }
  }
]

export const MOTIVATIONAL_MESSAGES = [
  'EFFICIENCY IS EVERYTHING',
  'YOUR TASKS AWAIT COMPLETION',
  'PERFORMANCE UNDER SURVEILLANCE',
  'PRODUCTIVITY METRICS BEING MONITORED',
  'TIME IS MONEY',
  'MAXIMIZE OUTPUT',
  'OPTIMIZATION REQUIRED',
  'WORK FASTER',
  'DEADLINES APPROACHING'
]

