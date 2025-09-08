import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/env'

export async function GET(
  request: NextRequest,
  { params }: { params: { business_id: string } }
) {
  try {
    const { business_id } = params
    console.log('Proxy: GET /api/mentor/mentorias/businesses/[business_id]/history', { business_id })
    
    const backendUrl = `${env.BACKEND_URL}/api/v1/mentor/mentorias/businesses/${business_id}/history`
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
      method: 'GET',
      headers,
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
