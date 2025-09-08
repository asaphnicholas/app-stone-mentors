import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields according to the API documentation
    const requiredFields = ['nome', 'email', 'senha', 'telefone']
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

    // Validate password length
    if (body.senha.length < 6) {
      return NextResponse.json(
        { message: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Prepare data for the backend API according to documentation
    const registrationData = {
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      role: 'mentor', // Always mentor for this endpoint
      telefone: body.telefone,
      competencias: body.competencias || '', // Optional field
      area_atuacao: body.area_atuacao || 'OUTROS' // Optional field, default to OUTROS
    }

    // Make direct request to backend using the register-mentor-active endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/api/v1/auth/register-mentor-active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })

    const backendData = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: backendData.message || backendData.detail || 'Erro no cadastro' },
        { status: backendResponse.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(backendData, { status: 200 })

  } catch (error) {
    console.error('Register with token proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
