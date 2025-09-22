import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/config/env'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mentorId = params.id
    const { searchParams } = new URL(request.url)
    
    // Obter parâmetros de query
    const motivo = searchParams.get('motivo')
    const forcar = searchParams.get('forcar')

    if (!motivo) {
      return NextResponse.json(
        { erro: 'O motivo da deleção é obrigatório' },
        { status: 400 }
      )
    }

    // Construir URL com parâmetros
    const backendUrl = new URL(`${API_BASE_URL}/admin/mentors/${mentorId}`)
    backendUrl.searchParams.append('motivo', motivo)
    if (forcar) {
      backendUrl.searchParams.append('forcar', forcar)
    }

    console.log('Deletando mentor:', mentorId, 'com parâmetros:', { motivo, forcar })

    // Fazer requisição para o backend
    const response = await fetch(backendUrl.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    if (!response.ok) {
      console.error('Erro na resposta do backend:', response.status, response.statusText)
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { 
          erro: 'Erro ao deletar mentor',
          details: errorData || `Status: ${response.status} - ${response.statusText}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro no proxy de deleção de mentor:', error)
    return NextResponse.json(
      { 
        erro: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
