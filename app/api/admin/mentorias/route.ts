import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * GET /api/admin/mentorias
 * Lista todas as mentorias com filtros e paginação
 * 
 * Query Parameters:
 * - status (opcional): DISPONIVEL, CONFIRMADA, EM_ANDAMENTO, FINALIZADA, CANCELADA
 * - negocio_id (opcional): Filtrar por negócio específico
 * - mentor_id (opcional): Filtrar por mentor específico
 * - tipo (opcional): PRIMEIRA, FOLLOWUP
 * - data_inicio (opcional): Data de início (YYYY-MM-DD)
 * - data_fim (opcional): Data de fim (YYYY-MM-DD)
 * - skip (opcional): Paginação - registros para pular (padrão: 0)
 * - limit (opcional): Paginação - máximo por página (padrão: 50, máx: 200)
 * - search (opcional): Buscar por nome do negócio, empreendedor ou mentor
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
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/admin/mentorias`)
    
    // Passar todos os query params para o backend
    const allowedParams = [
      'status',
      'negocio_id',
      'mentor_id',
      'tipo',
      'data_inicio',
      'data_fim',
      'skip',
      'limit',
      'search'
    ]
    
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) {
        backendUrl.searchParams.append(param, value)
      }
    })

    console.log('[Admin Mentorias List] Fazendo requisição para:', backendUrl.toString())

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
      console.error('[Admin Mentorias List] Erro na resposta do backend:', response.status, data)
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar mentorias' },
        { status: response.status }
      )
    }

    console.log('[Admin Mentorias List] Resposta bem-sucedida:', {
      total: data.total,
      mentorias: data.mentorias?.length
    })
    
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('[Admin Mentorias List] Erro no proxy:', error)
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

