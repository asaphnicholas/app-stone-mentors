import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    const { id: materialId } = await params
    const body = await request.json()
    console.log('Admin materials PUT - ID:', materialId)
    console.log('Admin materials PUT - Body recebido:', body)
    
    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/v1/admin/materials/${materialId}`
    console.log('Admin materials PUT - Enviando para backend:', backendUrl)
    console.log('Admin materials PUT - Body para backend:', JSON.stringify(body, null, 2))
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('Admin materials PUT - Resposta do backend:', { status: response.status, data })

    if (!response.ok) {
      console.log('Admin materials PUT - Erro do backend:', { status: response.status, data })
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao atualizar material' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Admin materials update proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    const { id: materialId } = await params
    console.log('Admin materials DELETE - ID:', materialId)
    
    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/v1/admin/materials/${materialId}`
    console.log('Admin materials DELETE - Enviando para backend:', backendUrl)
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()
    console.log('Admin materials DELETE - Resposta do backend:', { status: response.status, data })

    if (!response.ok) {
      console.log('Admin materials DELETE - Erro do backend:', { status: response.status, data })
      return NextResponse.json(
        { message: data.message || data.detail || 'Erro ao deletar material' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Admin materials delete proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
