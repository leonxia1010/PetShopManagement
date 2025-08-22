export interface HealthResponse {
  status: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
  createdAt: string
  updatedAt: string
}
