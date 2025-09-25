import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function PUT(
  request: NextRequest,
  { params }: { params: { mentor_id: string } }
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

    const mentorId = params.mentor_id
    const body = await request.json()

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/v1/admin/mentors/status/${mentorId}/status`
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao atualizar status do mentor' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Mentor status update proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
