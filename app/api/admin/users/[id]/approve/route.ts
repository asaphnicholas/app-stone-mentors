import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    const { id: userId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.status) {
      return NextResponse.json(
        { message: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/users/${userId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao aprovar/rejeitar usuário' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Admin user approve proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
