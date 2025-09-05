// Proxy utility functions for API routes

export interface ProxyConfig {
  backendUrl: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  queryParams?: Record<string, string>
}

export class ProxyError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ProxyError'
  }
}

export async function proxyRequest(config: ProxyConfig): Promise<any> {
  const { backendUrl, endpoint, method, headers = {}, body, queryParams } = config

  try {
    // Build URL with query parameters
    const url = new URL(`${backendUrl}${endpoint}`)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body)
    }

    // Make request to backend
    const response = await fetch(url.toString(), requestOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new ProxyError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      )
    }

    return data

  } catch (error) {
    if (error instanceof ProxyError) {
      throw error
    }

    // Handle network errors
    throw new ProxyError(
      'Erro de conexão com o servidor',
      500,
      { originalError: error }
    )
  }
}

export function createProxyHandler(backendUrl: string) {
  return {
    async get(endpoint: string, headers?: Record<string, string>, queryParams?: Record<string, string>) {
      return proxyRequest({
        backendUrl,
        endpoint,
        method: 'GET',
        headers,
        queryParams,
      })
    },

    async post(endpoint: string, body: any, headers?: Record<string, string>) {
      return proxyRequest({
        backendUrl,
        endpoint,
        method: 'POST',
        headers,
        body,
      })
    },

    async put(endpoint: string, body: any, headers?: Record<string, string>) {
      return proxyRequest({
        backendUrl,
        endpoint,
        method: 'PUT',
        headers,
        body,
      })
    },

    async delete(endpoint: string, headers?: Record<string, string>) {
      return proxyRequest({
        backendUrl,
        endpoint,
        method: 'DELETE',
        headers,
      })
    },
  }
}

// Helper function to extract authorization header
export function getAuthHeader(request: Request): string | null {
  return request.headers.get('authorization')
}

// Helper function to validate required fields
export function validateRequiredFields(body: any, requiredFields: string[]): string[] {
  return requiredFields.filter(field => !body[field])
}

// Helper function to create error response
export function createErrorResponse(message: string, status: number, details?: any) {
  return {
    message,
    status,
    details,
  }
}
