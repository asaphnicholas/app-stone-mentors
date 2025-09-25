import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(
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

    const mentorId = params.id
    const body = await request.json()

    console.log('Desativando mentor:', mentorId, 'com dados:', body)

    // Fazer requisição para o backend
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/mentors/${mentorId}/desativar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error('Erro na resposta do backend:', response.status, response.statusText)
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { 
          erro: 'Erro ao desativar mentor',
          details: errorData || `Status: ${response.status} - ${response.statusText}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro no proxy de desativação de mentor:', error)
    return NextResponse.json(
      { 
        erro: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
