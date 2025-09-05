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
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/materials${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar materiais' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Admin materials proxy error:', error)
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
    console.log('Admin materials POST - Body recebido:', body)
    console.log('Admin materials POST - Auth header:', authHeader.substring(0, 20) + '...')
    
    // Validate required fields
    const requiredFields = ['titulo', 'descricao', 'tipo', 'obrigatorio', 'ordem']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.log('Admin materials POST - Campos obrigatórios faltando:', missingFields)
      return NextResponse.json(
        { message: `Campos obrigatórios: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/v1/admin/materials`
    console.log('Admin materials POST - Enviando para backend:', backendUrl)
    console.log('Admin materials POST - Body para backend:', JSON.stringify(body, null, 2))
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('Admin materials POST - Resposta do backend:', { status: response.status, data })

    if (!response.ok) {
      console.log('Admin materials POST - Erro do backend:', { status: response.status, data })
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao criar material' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Admin materials create proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
