import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/businesses${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar negócios' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Admin businesses GET proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ['nome', 'area_atuacao']
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

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/businesses`, {
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
        { message: data.message || 'Erro ao criar negócio' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Admin businesses POST proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
