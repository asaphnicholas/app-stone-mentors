import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/mentorias/[id]/diagnostico/export?format=json|csv
 * Proxy: GET /api/v1/admin/mentorias/{mentoria_id}/diagnostico/export?format=...
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
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    if (!mentoriaId) {
      return NextResponse.json(
        { message: 'ID da mentoria é obrigatório' },
        { status: 400 }
      )
    }

    if (format !== 'json' && format !== 'csv') {
      return NextResponse.json(
        { message: 'Parâmetro format deve ser json ou csv' },
        { status: 400 }
      )
    }

    const backendUrl = `${BACKEND_URL}/api/v1/admin/mentorias/${mentoriaId}/diagnostico/export?format=${format}`
    console.log('[Admin Mentoria Diagnostico Export] GET:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Admin Mentoria Diagnostico Export] Erro:', response.status, errorData)
      return NextResponse.json(
        { message: errorData.message || errorData.detail || 'Erro ao exportar diagnóstico' },
        { status: response.status }
      )
    }

    const contentType =
      response.headers.get('Content-Type') ||
      (format === 'csv' ? 'text/csv; charset=utf-8' : 'application/json')
    const contentDisposition =
      response.headers.get('Content-Disposition') ||
      `attachment; filename="diagnostico_mentoria_${mentoriaId}.${format}"`

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    })
  } catch (error) {
    console.error('[Admin Mentoria Diagnostico Export] Erro no proxy:', error)
    return NextResponse.json(
      {
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
