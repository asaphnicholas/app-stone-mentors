import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Construir query parameters
    const queryParams = new URLSearchParams()
    
    // Parâmetros obrigatórios
    queryParams.append('role', 'mentor')
    
    // Parâmetros opcionais
    const status = searchParams.get('status')
    if (status) queryParams.append('status', status)
    
    const area_atuacao = searchParams.get('area_atuacao')
    if (area_atuacao) queryParams.append('area_atuacao', area_atuacao)
    
    const search = searchParams.get('search')
    if (search) queryParams.append('search', search)
    
    const protocolo_concluido = searchParams.get('protocolo_concluido')
    if (protocolo_concluido) queryParams.append('protocolo_concluido', protocolo_concluido)
    
    const termo_aceite = searchParams.get('termo_aceite')
    if (termo_aceite) queryParams.append('termo_aceite', termo_aceite)
    
    const page = searchParams.get('page') || '1'
    queryParams.append('page', page)
    
    const limit = searchParams.get('limit') || '10'
    queryParams.append('limit', limit)

    const backendUrl = `${BACKEND_URL}/api/v1/admin/users?${queryParams.toString()}`

    console.log('Fazendo requisição para:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        {
          erro: 'Erro ao buscar usuários',
          details: errorData || `Status: ${response.status} - ${response.statusText}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro no proxy de usuários:', error)
    return NextResponse.json(
      {
        erro: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}