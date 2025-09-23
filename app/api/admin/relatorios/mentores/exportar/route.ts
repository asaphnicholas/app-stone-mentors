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

    const { searchParams } = new URL(request.url)
    
    // Construir URL com parâmetros
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/admin/relatorios/mentores/exportar`)
    
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
        'Authorization': authHeader,
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
