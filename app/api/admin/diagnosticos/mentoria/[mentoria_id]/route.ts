import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/diagnosticos/mentoria/[mentoria_id]
 * Obtém diagnóstico por mentoria específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mentoria_id: string }> }
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

    const { mentoria_id } = await params

    const backendUrl = `${BACKEND_URL}/api/v1/admin/diagnosticos/mentoria/${mentoria_id}`
    console.log('[Admin Diagnostico by Mentoria] Fazendo requisição para:', backendUrl)

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
      console.error('[Admin Diagnostico by Mentoria] Erro na resposta do backend:', response.status, data)
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao buscar diagnóstico' },
        { status: response.status }
      )
    }

    console.log('[Admin Diagnostico by Mentoria] Resposta bem-sucedida')
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('[Admin Diagnostico by Mentoria] Erro no proxy:', error)
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
