import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/config/env'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mentorId = params.id
    const body = await request.json()

    console.log('Desativando mentor:', mentorId, 'com dados:', body)

    // Fazer requisição para o backend
    const response = await fetch(`${API_BASE_URL}/admin/mentors/${mentorId}/desativar`, {
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
