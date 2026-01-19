import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/diagnosticos
 * Lista todos os diagnósticos com filtros
 * 
 * Query Parameters:
 * - mentoria_id (opcional): UUID da mentoria
 * - mentor_id (opcional): UUID do mentor
 * - negocio_id (opcional): UUID do negócio
 * - data_inicio (opcional): YYYY-MM-DD
 * - data_fim (opcional): YYYY-MM-DD
 * - skip (opcional): padrão 0
 * - limit (opcional): padrão 50, máx 200
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
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/admin/diagnosticos`)
    
    // Passar todos os query params para o backend
    const allowedParams = [
      'mentoria_id',
      'mentor_id',
      'negocio_id',
      'data_inicio',
      'data_fim',
      'skip',
      'limit'
    ]
    
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) {
        backendUrl.searchParams.append(param, value)
      }
    })

    console.log('[Admin Diagnosticos] Fazendo requisição para:', backendUrl.toString())

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
      console.error('[Admin Diagnosticos] Erro na resposta do backend:', response.status, data)
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao buscar diagnósticos' },
        { status: response.status }
      )
    }

    console.log('[Admin Diagnosticos] Resposta bem-sucedida:', {
      total: data.total,
      diagnosticos: data.diagnosticos?.length
    })
    
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('[Admin Diagnosticos] Erro no proxy:', error)
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
