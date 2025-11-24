import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/env'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('Proxy: POST /api/mentor/mentorias/[id]/confirm', { id })
    
    const backendUrl = `${env.BACKEND_URL}/api/v1/mentor/mentorias/${id}/confirm`
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
      body: JSON.stringify({}),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)

      const errorMessage =
        errorData.message ||
        errorData.detail ||
        errorData.error ||
        `HTTP ${response.status}: ${response.statusText}`

      return NextResponse.json(
        {
          message: errorMessage,
          details: errorData,
        },
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
