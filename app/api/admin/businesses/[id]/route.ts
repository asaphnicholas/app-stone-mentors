import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/config/env'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      // Tentar pegar do header Authorization como fallback
      const authHeader = request.headers.get('Authorization')
      const headerToken = authHeader?.replace('Bearer ', '')
      
      if (!headerToken) {
        return NextResponse.json(
          { error: 'Token de autenticação não encontrado' },
          { status: 401 }
        )
      }
    }

    const body = await request.json()
    
    // Usar o token apropriado (cookie ou header)
    const authToken = token || request.headers.get('Authorization')?.replace('Bearer ', '')

    const { id } = await params
    const response = await fetch(`${env.BACKEND_URL}/api/v1/admin/businesses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: 'Erro ao atualizar negócio' },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      // Tentar pegar do header Authorization como fallback
      const authHeader = request.headers.get('Authorization')
      const headerToken = authHeader?.replace('Bearer ', '')
      
      if (!headerToken) {
        return NextResponse.json(
          { error: 'Token de autenticação não encontrado' },
          { status: 401 }
        )
      }
    }

    // Usar o token apropriado (cookie ou header)
    const authToken = token || request.headers.get('Authorization')?.replace('Bearer ', '')

    const { id: deleteId } = await params
    const response = await fetch(`${env.BACKEND_URL}/api/v1/admin/businesses/${deleteId}`, {
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
        { error: 'Erro ao deletar negócio' },
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