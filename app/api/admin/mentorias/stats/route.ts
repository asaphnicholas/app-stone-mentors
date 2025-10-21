import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/mentorias/stats
 * Retorna estatísticas consolidadas de mentorias
 * 
 * Query Parameters:
 * - data_inicio (opcional): Data de início (YYYY-MM-DD)
 * - data_fim (opcional): Data de fim (YYYY-MM-DD)
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
    const data_inicio = searchParams.get('data_inicio')
    const data_fim = searchParams.get('data_fim')

    // Construir URL com parâmetros
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/admin/mentorias/stats`)
    
    if (data_inicio) {
      backendUrl.searchParams.append('data_inicio', data_inicio)
    }
    if (data_fim) {
      backendUrl.searchParams.append('data_fim', data_fim)
    }

    console.log('[Admin Mentorias Stats] Fazendo requisição para:', backendUrl.toString())

    // Forward request to backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Admin Mentorias Stats] Erro na resposta do backend:', response.status, data)
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar estatísticas de mentorias' },
        { status: response.status }
      )
    }

    console.log('[Admin Mentorias Stats] Resposta bem-sucedida')
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('[Admin Mentorias Stats] Erro no proxy:', error)
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

