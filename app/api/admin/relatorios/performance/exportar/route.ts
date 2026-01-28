import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/relatorios/performance/exportar
 * Exporta relatório de performance de mentores em CSV
 */
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
    
    // Construir URL com parâmetros
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/admin/relatorios/performance/exportar`)
    
    // Passar filtros para o backend
    const allowedParams = [
      'periodo_inicio',
      'periodo_fim'
    ]
    
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) {
        backendUrl.searchParams.append(param, value)
      }
    })

    console.log('[Admin Relatorios Performance] Fazendo requisição para:', backendUrl.toString())

    // Forward request to backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Admin Relatorios Performance] Erro na resposta do backend:', response.status, errorData)
      return NextResponse.json(
        { message: errorData.message || errorData.detail || 'Erro ao exportar relatório de performance' },
        { status: response.status }
      )
    }

    // Get CSV content
    const csvContent = await response.text()
    const contentDisposition = response.headers.get('Content-Disposition') || 
      `attachment; filename="relatorio_performance_${new Date().toISOString().slice(0,10).replace(/-/g, '')}_${new Date().toTimeString().slice(0,8).replace(/:/g, '')}.csv"`

    console.log('[Admin Relatorios Performance] Export bem-sucedido')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': contentDisposition,
      },
    })

  } catch (error) {
    console.error('[Admin Relatorios Performance] Erro no proxy:', error)
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
