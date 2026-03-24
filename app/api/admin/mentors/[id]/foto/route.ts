import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/mentors/[id]/foto
 * Proxy para download da foto do mentor (admin).
 * Backend esperado: GET /api/v1/admin/mentors/{id}/foto
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ message: 'Token de autorização é obrigatório' }, { status: 401 })
    }

    const { id: mentorId } = await params
    const backendUrl = `${BACKEND_URL}/api/v1/admin/mentors/${mentorId}/foto`

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return NextResponse.json(
        { message: err.message || err.detail || 'Foto não encontrada' },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
    const contentDisposition =
      response.headers.get('Content-Disposition') ||
      `attachment; filename="foto_mentor_${mentorId}.jpg"`

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    })
  } catch (error) {
    console.error('[Admin Mentor Foto] Erro:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
