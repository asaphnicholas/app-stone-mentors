// API Configuration and Base Service
import { env, STORAGE_KEYS } from '@/lib/config/env'

// Use internal proxy routes instead of direct backend URLs
const API_BASE_URL = env.API_BASE_URL // '/api'
const API_URL = env.API_URL // ''

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status?: number
  details?: any
}

class ApiService {
  private baseURL: string
  private apiBaseURL: string

  constructor() {
    this.baseURL = API_URL
    this.apiBaseURL = API_BASE_URL
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          console.log('Auth token found:', token.substring(0, 20) + '...')
        }
        return token
      } catch (error) {
        console.error('Error accessing localStorage:', error)
        return null
      }
    }
    return null
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      } else {
        console.warn('No auth token found in localStorage')
      }
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle authentication errors
      if (response.status === 401) {
        console.error('Authentication failed - token may be invalid or expired')
        // Optionally clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        }
      }
      
      throw {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorData
      } as ApiError
    }

    return response.json()
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const url = `${this.apiBaseURL}${endpoint}`
    const headers = this.getHeaders(includeAuth)
    
    console.log('Making GET request to:', url)
    console.log('Headers:', headers)
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data: any, includeAuth: boolean = true): Promise<T> {
    const url = `${this.apiBaseURL}${endpoint}`
    const headers = this.getHeaders(includeAuth)
    
    // Handle FormData (for file uploads)
    let body: string | FormData
    if (data instanceof FormData) {
      // Remove Content-Type header for FormData to let browser set it with boundary
      delete (headers as any)['Content-Type']
      body = data
      console.log('Making POST request with FormData to:', url)
    } else {
      body = JSON.stringify(data)
      console.log('Making POST request with JSON to:', url)
      console.log('Data:', data)
    }
    
    console.log('Headers:', headers)

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data: any, includeAuth: boolean = true): Promise<T> {
    const url = `${this.apiBaseURL}${endpoint}`
    const headers = this.getHeaders(includeAuth)
    
    // Handle FormData (for file uploads)
    let body: string | FormData
    if (data instanceof FormData) {
      // Remove Content-Type header for FormData to let browser set it with boundary
      delete (headers as any)['Content-Type']
      body = data
      console.log('Making PUT request with FormData to:', url)
    } else {
      body = JSON.stringify(data)
      console.log('Making PUT request with JSON to:', url)
      console.log('Data:', data)
    }
    
    console.log('Headers:', headers)

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const url = `${this.apiBaseURL}${endpoint}`
    const headers = this.getHeaders(includeAuth)
    
    console.log('Making DELETE request to:', url)
    console.log('Headers:', headers)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    })

    return this.handleResponse<T>(response)
  }

  // Utility methods
  getBaseURL(): string {
    return this.baseURL
  }

  getApiBaseURL(): string {
    return this.apiBaseURL
  }

  isDevelopment(): boolean {
    return env.isDevelopment()
  }

  isProduction(): boolean {
    return env.isProduction()
  }
}

export const apiService = new ApiService()
export default apiService
