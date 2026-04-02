import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

const BACKEND_REGISTER_PATH = `${BACKEND_URL}/api/v1/auth/register-mentor-active`
const ESCOLARIDADE_NOVA_VALUES = new Set([
  'ensino_medio_completo',
  'ensino_medio_incompleto',
  'ensino_superior_completo',
  'ensino_superior_incompleto',
  'pos_graduacao_completa',
  'pos_graduacao_incompleta',
  'mestrado',
  'doutorado',
])

function isEscolaridadeMigrationError(message?: string): boolean {
  if (!message) return false
  const normalized = message.toLowerCase()
  return (
    normalized.includes('escolaridade inválida para o ambiente atual') ||
    normalized.includes('novos valores de escolaridade') ||
    (normalized.includes('escolaridade inválida') && normalized.includes('migrado'))
  )
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // Multipart: encaminha para o backend (foto + demais campos)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      let backendResponse = await fetch(BACKEND_REGISTER_PATH, {
        method: 'POST',
        body: formData,
      })

      let backendData = await backendResponse.json().catch(() => ({}))

      const areaFormacao = formData.get('area_formacao')
      if (
        !backendResponse.ok &&
        (backendResponse.status === 400 || backendResponse.status === 422) &&
        typeof areaFormacao === 'string' &&
        ESCOLARIDADE_NOVA_VALUES.has(areaFormacao) &&
        isEscolaridadeMigrationError(backendData.message || backendData.detail)
      ) {
        const fallbackFormData = new FormData()
        for (const [key, value] of formData.entries()) {
          fallbackFormData.append(key, value)
        }
        fallbackFormData.set('area_formacao', 'OUTRO')

        backendResponse = await fetch(BACKEND_REGISTER_PATH, {
          method: 'POST',
          body: fallbackFormData,
        })
        backendData = await backendResponse.json().catch(() => ({}))
      }

      if (!backendResponse.ok) {
        return NextResponse.json(
          { message: backendData.message || backendData.detail || 'Erro no cadastro' },
          { status: backendResponse.status }
        )
      }

      return NextResponse.json(backendData, { status: 200 })
    }

    // JSON (compatibilidade / legado — foto não obrigatória)
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

    let backendResponse = await fetch(BACKEND_REGISTER_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })

    let backendData = await backendResponse.json().catch(() => ({}))

    if (
      !backendResponse.ok &&
      (backendResponse.status === 400 || backendResponse.status === 422) &&
      typeof registrationData.area_formacao === 'string' &&
      ESCOLARIDADE_NOVA_VALUES.has(registrationData.area_formacao) &&
      isEscolaridadeMigrationError(backendData.message || backendData.detail)
    ) {
      const fallbackData = {
        ...registrationData,
        area_formacao: 'OUTRO',
      }
      backendResponse = await fetch(BACKEND_REGISTER_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackData),
      })
      backendData = await backendResponse.json().catch(() => ({}))
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: backendData.message || backendData.detail || 'Erro no cadastro' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(backendData, { status: 200 })
  } catch (error) {
    console.error('[register-mentor-active] proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
