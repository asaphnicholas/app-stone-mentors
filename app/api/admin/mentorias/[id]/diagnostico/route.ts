import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/mentorias/[id]/diagnostico
 * Proxy: GET /api/v1/admin/mentorias/{mentoria_id}/diagnostico
 * Mesmo payload que GET /api/v1/admin/diagnosticos/mentoria/{mentoria_id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    const { id: mentoriaId } = await params

    if (!mentoriaId) {
      return NextResponse.json(
        { message: 'ID da mentoria é obrigatório' },
        { status: 400 }
      )
    }

    const backendUrl = `${BACKEND_URL}/api/v1/admin/mentorias/${mentoriaId}/diagnostico`
    console.log('[Admin Mentoria Diagnostico] GET:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Admin Mentoria Diagnostico] Erro:', response.status, data)
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao buscar diagnóstico da mentoria' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('[Admin Mentoria Diagnostico] Erro no proxy:', error)
    return NextResponse.json(
      {
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
