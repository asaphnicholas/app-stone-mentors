// Environment Configuration
export const env = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API URLs - Using internal proxy routes
  API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  
  // Backend URL (server-side only)
  BACKEND_URL: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
  
  // Environment checks
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
} as const

// API Endpoints - Using internal proxy routes
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Mentors
  MENTORS: {
    LIST: '/mentors',
    DETAIL: (id: string) => `/mentors/${id}`,
    UPDATE: (id: string) => `/mentors/${id}`,
  },
  
  // Mentoring Sessions
  SESSIONS: {
    LIST: '/sessions',
    DETAIL: (id: string) => `/sessions/${id}`,
    CREATE: '/sessions',
    UPDATE: (id: string) => `/sessions/${id}`,
    DELETE: (id: string) => `/sessions/${id}`,
  },
  
  // Business
  BUSINESS: {
    LIST: '/business',
    DETAIL: (id: string) => `/business/${id}`,
    CREATE: '/business',
    UPDATE: (id: string) => `/business/${id}`,
    DELETE: (id: string) => `/business/${id}`,
  },

  // Admin Materials
  ADMIN: {
    MATERIALS: '/admin/materials',
    MATERIALS_UPLOAD: '/admin/materials/upload',
    USERS: '/admin/users',
    USERS_PENDING: '/admin/users/pending',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    USER_APPROVE: (id: string) => `/admin/users/${id}/approve`,
    DASHBOARD_OVERVIEW: '/admin/dashboard/overview',
    BUSINESSES: '/admin/businesses',
    // Admin Mentors
    MENTORS_WITH_MENTORIAS: '/admin/mentors/with-mentorias',
    MENTOR_HISTORICO: (id: string) => `/admin/mentors/${id}/mentorias/historico`,
    MENTOR_PERFORMANCE: (id: string) => `/admin/mentors/${id}/performance`,
    MENTORS_RELATORIO: '/admin/mentors/relatorios/mentorias',
  },

  // Mentor Materials
  MENTOR: {
    MATERIALS: '/mentor/materials',
    MATERIALS_COMPLETE: (id: string) => `/mentor/materials/${id}/complete`,
    QUALIFICATION_STATUS: '/mentor/qualification-status',
  },

  // File Access
  FILES: {
    MATERIAL_ACCESS: (id: string) => `/files/material/${id}`,
    MATERIAL_INFO: (id: string) => `/files/material/${id}/info`,
    MATERIAL_DOWNLOAD: (id: string) => `/files/material/${id}/download`,
  },
} as const

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

export default env
