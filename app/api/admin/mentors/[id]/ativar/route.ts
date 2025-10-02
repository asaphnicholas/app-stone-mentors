import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mentorId } = await params
    const body = await request.json()

    console.log('Ativando mentor:', mentorId, 'com dados:', body)

    // Fazer requisição para o backend
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/mentors/${mentorId}/ativar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error('Erro na resposta do backend:', response.status, response.statusText)
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { 
          erro: 'Erro ao ativar mentor',
          details: errorData || `Status: ${response.status} - ${response.statusText}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro no proxy de ativação de mentor:', error)
    return NextResponse.json(
      { 
        erro: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
