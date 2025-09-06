import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/env'

export async function POST(request: NextRequest) {
  try {
    console.log('Proxy: POST /api/mentor/mentorias/schedule-next')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const backendUrl = `${env.BACKEND_URL}/api/v1/mentor/mentorias/schedule-next`
    console.log('Forwarding to backend:', backendUrl)
    
    // Get authorization header from request
    const authHeader = request.headers.get('authorization')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers.Authorization = authHeader
    }
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { message: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('Backend response:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
