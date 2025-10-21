import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/mentorias/[id]
 * Retorna detalhes completos de uma mentoria específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const mentoriaId = params.id

    if (!mentoriaId) {
      return NextResponse.json(
        { message: 'ID da mentoria é obrigatório' },
        { status: 400 }
      )
    }

    const backendUrl = `${BACKEND_URL}/api/v1/admin/mentorias/${mentoriaId}`
    
    console.log('[Admin Mentoria Details] Fazendo requisição para:', backendUrl)

    // Forward request to backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Admin Mentoria Details] Erro na resposta do backend:', response.status, data)
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar detalhes da mentoria' },
        { status: response.status }
      )
    }

    console.log('[Admin Mentoria Details] Resposta bem-sucedida para mentoria:', mentoriaId)
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('[Admin Mentoria Details] Erro no proxy:', error)
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

