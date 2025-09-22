import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/config/env'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Construir URL com parâmetros
    const backendUrl = new URL(`${API_BASE_URL}/admin/relatorios/mentores/exportar`)
    
    // Adicionar parâmetros de query se existirem
    const periodo_inicio = searchParams.get('periodo_inicio')
    const periodo_fim = searchParams.get('periodo_fim')
    const incluir_inativos = searchParams.get('incluir_inativos')
    
    if (periodo_inicio) {
      backendUrl.searchParams.append('periodo_inicio', periodo_inicio)
    }
    if (periodo_fim) {
      backendUrl.searchParams.append('periodo_fim', periodo_fim)
    }
    if (incluir_inativos) {
      backendUrl.searchParams.append('incluir_inativos', incluir_inativos)
    }

    console.log('Fazendo requisição para:', backendUrl.toString())

    // Fazer requisição para o backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Adicionar headers de autenticação se necessário
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    if (!response.ok) {
      console.error('Erro na resposta do backend:', response.status, response.statusText)
      return NextResponse.json(
        { 
          erro: 'Erro ao exportar relatório de mentores',
          details: `Status: ${response.status} - ${response.statusText}`
        },
        { status: response.status }
      )
    }

    // Obter o conteúdo CSV
    const csvContent = await response.text()
    
    // Retornar o CSV com headers apropriados
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="relatorio-mentores-${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Erro no proxy de relatório de mentores:', error)
    return NextResponse.json(
      { 
        erro: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
