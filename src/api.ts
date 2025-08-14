const API_BASE = import.meta.env.VITE_API_BASE || ''

// Mock data for development/testing
const MOCK_LESSONS = [
  { id: 1, title: "Basic Addition", description: "Learn to add numbers from 1 to 10", progress: 0.8 },
  { id: 2, title: "Simple Subtraction", description: "Practice subtracting numbers", progress: 0.3 },
  { id: 3, title: "Multiplication Tables", description: "Master the times tables", progress: 0.0 },
]

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  // If no API_BASE is set, return mock data
  if (!API_BASE) {
    console.warn('No API_BASE set, using mock data')
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    
    if (path === '/api/lessons') {
      return { lessons: MOCK_LESSONS } as T
    }
    if (path.startsWith('/api/lessons/') && path.endsWith('/submit')) {
      return { success: true, score: 85 } as T
    }
    if (path === '/api/profile') {
      return { name: "Student", level: 3, totalScore: 1250 } as T
    }
    
    throw new Error('Mock endpoint not found')
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export type LessonListItem = { id: number; title: string; description: string; progress: number }
export type LessonDetail = { id: number; title: string; description: string; progress: number; problems: any[] }

export async function getLessons() { return http<{ lessons: LessonListItem[] }>(`/api/lessons`) }
export async function getLesson(id: number) { return http<LessonDetail>(`/api/lessons/${id}`) }
export async function submitLesson(id: number, payload: any) { return http<any>(`/api/lessons/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }) }
export async function getProfile() { return http<any>(`/api/profile`) } 