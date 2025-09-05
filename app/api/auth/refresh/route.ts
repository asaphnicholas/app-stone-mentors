import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.refresh_token) {
      return NextResponse.json(
        { message: 'Refresh token é obrigatório' },
        { status: 400 }
      )
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao renovar token' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Refresh token proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
