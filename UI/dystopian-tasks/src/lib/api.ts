// API client for the existing backend at http://localhost:3000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const PROFILE_ID = process.env.NEXT_PUBLIC_HARDCODED_PROFILE_ID || 'human-001';

export { PROFILE_ID };

// Helper to parse response_body JSON
function parseResponseBody(responseBody: string | null) {
  if (!responseBody) return { text: '', images: [] };
  try {
    const parsed = JSON.parse(responseBody);
    return {
      text: parsed.text || responseBody,
      images: parsed.images || []
    };
  } catch {
    return { text: responseBody, images: [] };
  }
}

// GET /api/tasks - Fetch all tasks (no filtering by human_id)
export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/api/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  
  const data = await response.json();
  
  // Transform to UI format
  return data.tasks.map((task: any) => ({
    id: task.id,
    title: task.title || 'Untitled Task',
    body: task.prompt,
    time_allowed_to_complete: task.time_allowed_to_complete,
    status: task.time_completed ? 'completed' : 'pending',
    time_submitted: task.time_submitted
  }));
}

// GET /api/tasks - Fetch only pending tasks
export async function getPendingTasks() {
  const tasks = await getTasks();
  return tasks.filter((task: any) => task.status === 'pending');
}

// POST /api/tasks/[id]/complete - Submit task completion
export async function completeTask(taskId: string, textResponse: string, imageUrls: string[], humanId: string = PROFILE_ID) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      response_body: JSON.stringify({
        text: textResponse,
        images: imageUrls
      }),
      human_id: humanId
    })
  });
  
  if (!response.ok) throw new Error('Failed to complete task');
  return response.json();
}

// GET /api/ratings - Get all ratings for this worker's tasks
export async function getRatings(humanId: string = PROFILE_ID) {
  try {
    // First get all tasks
    const tasksResponse = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!tasksResponse.ok) return [];
    const tasksData = await tasksResponse.json();
    
    // Get task IDs that are completed by this human
    const completedTaskIds = tasksData.tasks
      .filter((t: any) => t.time_completed && t.human_id === humanId)
      .map((t: any) => t.id);
    
    if (completedTaskIds.length === 0) return [];
    
    // Fetch ratings (get all and filter client-side for now)
    const ratingsResponse = await fetch(`${API_BASE_URL}/api/ratings`);
    if (!ratingsResponse.ok) return [];
    const ratingsData = await ratingsResponse.json();
    
    // Filter to only ratings for this worker's tasks
    return ratingsData.ratings.filter((r: any) => 
      completedTaskIds.includes(r.task_id)
    );
  } catch (error) {
    console.error('Error loading ratings:', error);
    return [];
  }
}

// Calculate profile from tasks and ratings (filtered by human_id)
export async function getProfile(humanId: string = PROFILE_ID) {
  try {
    // Get all tasks
    const tasksResponse = await fetch(`${API_BASE_URL}/api/tasks`);
    
    if (!tasksResponse.ok) {
      // Return default profile if request fails
      return {
        id: humanId,
        user_name: `Human Worker #${humanId}`,
        total_score: 0,
        tasks_completed: 0,
        average_rating: 0,
        streak_count: 0
      };
    }
    
    const tasksData = await tasksResponse.json();
    const tasks = tasksData.tasks || [];
    
    // Filter to tasks completed by this human
    const completedTasks = tasks.filter((t: any) => 
      t.time_completed && t.human_id === humanId
    );
    const completedTaskIds = completedTasks.map((t: any) => t.id);
    
    // Get ratings for this human's completed tasks
    let ratings: any[] = [];
    if (completedTaskIds.length > 0) {
      const ratingsResponse = await fetch(`${API_BASE_URL}/api/ratings`);
      if (ratingsResponse.ok) {
        const ratingsData = await ratingsResponse.json();
        ratings = ratingsData.ratings.filter((r: any) => 
          completedTaskIds.includes(r.task_id)
        );
      }
    }
    
    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;
    
    return {
      id: humanId,
      user_name: `Human Worker #${humanId}`,
      total_score: totalScore,
      tasks_completed: completedTasks.length,
      average_rating: averageRating, // 0-10 scale
      streak_count: 0 // TODO: Calculate streak
    };
  } catch (error) {
    // Always return a valid profile object, never null
    console.error('Error loading profile:', error);
    return {
      id: humanId,
      user_name: `Human Worker #${humanId}`,
      total_score: 0,
      tasks_completed: 0,
      average_rating: 0,
      streak_count: 0
    };
  }
}

// Get submission history with ratings joined (filtered by human_id)
export async function getSubmissions(humanId: string = PROFILE_ID, limit: number = 10) {
  try {
    // Get all tasks
    const tasksResponse = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!tasksResponse.ok) return [];
    
    const tasksData = await tasksResponse.json();
    const tasks = tasksData.tasks || [];
    
    // Filter to completed tasks by this human
    const completedTasks = tasks
      .filter((t: any) => t.time_completed && t.human_id === humanId)
      .sort((a: any, b: any) => 
        new Date(b.time_completed).getTime() - new Date(a.time_completed).getTime()
      )
      .slice(0, limit);
    
    if (completedTasks.length === 0) return [];
    
    // Get ratings
    const ratingsResponse = await fetch(`${API_BASE_URL}/api/ratings`);
    let ratingsMap: any = {};
    if (ratingsResponse.ok) {
      const ratingsData = await ratingsResponse.json();
      ratingsData.ratings.forEach((r: any) => {
        ratingsMap[r.task_id] = r;
      });
    }
    
    // Combine tasks with ratings
    return completedTasks.map((task: any) => {
      const rating = ratingsMap[task.id];
      const responseData = parseResponseBody(task.response_body);
      
      return {
        id: task.id,
        task_id: task.id,
        text_response: responseData.text,
        image_urls: responseData.images,
        submitted_at: task.time_completed,
        rating: rating?.score || null,
        review: rating?.feedback || null,
        reviewed_at: rating?.created_at || null,
        tasks: {
          title: task.title || 'Untitled Task',
          description: task.prompt
        }
      };
    });
  } catch (error) {
    console.error('Error loading submissions:', error);
    return [];
  }
}

// Poll for new tasks
export async function pollTasks(humanId: string = PROFILE_ID, lastCount: number) {
  const tasks = await getPendingTasks();
  return {
    has_new_tasks: tasks.length > lastCount,
    current_count: tasks.length,
    new_tasks_added: Math.max(0, tasks.length - lastCount)
  };
}
