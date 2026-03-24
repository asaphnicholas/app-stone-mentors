import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

const BACKEND_REGISTER_PATH = `${BACKEND_URL}/api/v1/auth/register-mentor-active`

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // Multipart: encaminha para o backend (foto + demais campos)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      const backendResponse = await fetch(BACKEND_REGISTER_PATH, {
        method: 'POST',
        body: formData,
      })

      const backendData = await backendResponse.json().catch(() => ({}))

      if (!backendResponse.ok) {
        return NextResponse.json(
          { message: backendData.message || backendData.detail || 'Erro no cadastro' },
          { status: backendResponse.status }
        )
      }

      return NextResponse.json(backendData, { status: 200 })
    }

    // JSON (compatibilidade)
    const body = await request.json()

    const requiredFields = ['nome', 'email', 'senha', 'telefone']
    const missingFields = requiredFields.filter((field) => {
      const value = body[field]
      return !value || (typeof value === 'string' && value.trim() === '')
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obrigatórios: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    if (body.senha.length < 6) {
      return NextResponse.json(
        { message: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    const registrationData: Record<string, unknown> = {
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      role: 'mentor',
      telefone: body.telefone,
      competencias: body.competencias ?? '',
      area_atuacao: body.area_atuacao ?? 'OUTROS',
      area_formacao: body.area_formacao,
      termo_aceite: body.termo_aceite,
      invite_token: body.invite_token ?? body.token,
    }

    const backendResponse = await fetch(BACKEND_REGISTER_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })

    const backendData = await backendResponse.json().catch(() => ({}))

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: backendData.message || backendData.detail || 'Erro no cadastro' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(backendData, { status: 200 })
  } catch (error) {
    console.error('Register with token proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
