import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields according to the API documentation
    const requiredFields = ['nome', 'email', 'senha', 'role', 'telefone', 'competencias', 'area_atuacao']
    const missingFields = requiredFields.filter(field => {
      const value = body[field]
      return !value || (typeof value === 'string' && value.trim() === '')
    })
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obrigatórios: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate role - should be 'mentor' for registrations
    if (body.role !== 'mentor') {
      return NextResponse.json(
        { message: 'Role deve ser "mentor" para cadastros' },
        { status: 400 }
      )
    }

    // Forward request to backend with exact structure from documentation
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro no cadastro' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Register proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
