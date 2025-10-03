import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/config/env'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    // Debug: log dos cookies
    console.log('Available cookies:', cookieStore.getAll().map((c: any) => c.name))
    console.log('Token found:', !!token)

    if (!token) {
      // Tentar pegar do header Authorization como fallback
      const authHeader = request.headers.get('Authorization')
      const headerToken = authHeader?.replace('Bearer ', '')
      
      if (!headerToken) {
        console.error('No token found in cookies or headers')
        return NextResponse.json(
          { error: 'Token de autenticação não encontrado' },
          { status: 401 }
        )
      }
      
      // Usar token do header
      console.log('Using token from header')
    }

    const { searchParams } = new URL(request.url)
    const motivo = searchParams.get('motivo')

    if (!motivo) {
      return NextResponse.json(
        { error: 'Motivo é obrigatório' },
        { status: 400 }
      )
    }

    // Usar o token apropriado (cookie ou header)
    const authToken = token || request.headers.get('Authorization')?.replace('Bearer ', '')
    
    const { id } = await params
    const url = new URL(`${env.BACKEND_URL}/api/v1/admin/businesses/${id}/unassign-mentor`)
    url.searchParams.set('motivo', motivo)

    console.log('Making request to:', url.toString())
    console.log('Using token:', authToken ? 'Token available' : 'No token')

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: 'Erro ao desvincular mentor' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
