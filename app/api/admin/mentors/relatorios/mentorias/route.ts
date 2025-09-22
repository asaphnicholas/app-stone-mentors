import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get('mentor_id')
    const periodoInicio = searchParams.get('periodo_inicio')
    const periodoFim = searchParams.get('periodo_fim')

    // Build query string for backend
    const queryParams = new URLSearchParams()
    if (mentorId) queryParams.append('mentor_id', mentorId)
    if (periodoInicio) queryParams.append('periodo_inicio', periodoInicio)
    if (periodoFim) queryParams.append('periodo_fim', periodoFim)

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/v1/admin/mentors/relatorios/mentorias${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao gerar relatório de mentorias' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Mentors relatorios proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
