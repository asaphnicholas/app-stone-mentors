import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/mentors/[id]/foto
 * Foto pública do mentor (sem auth) — para <img src="...">.
 * Proxy: GET /api/v1/mentors/{id}/foto
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mentorId } = await params
    if (!mentorId) {
      return NextResponse.json({ message: 'ID do mentor é obrigatório' }, { status: 400 })
    }

    const backendUrl = `${BACKEND_URL}/api/v1/mentors/${mentorId}/foto`
    const response = await fetch(backendUrl, { method: 'GET' })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return NextResponse.json(
        { message: err.message || err.detail || 'Foto não encontrada' },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[Public Mentor Foto] Erro:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
