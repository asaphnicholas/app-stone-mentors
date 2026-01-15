import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/env'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Proxy: PUT /api/mentor/mentorias/[id]/reschedule', { id })
    
    const backendUrl = `${env.BACKEND_URL}/api/v1/mentor/mentorias/${id}/reschedule`
    console.log('Forwarding to backend:', backendUrl)
    
    // Get request body
    const body = await request.json()
    console.log('Request body:', body)
    
    // Get authorization header from request
    const authHeader = request.headers.get('authorization')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers.Authorization = authHeader
    }
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
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
