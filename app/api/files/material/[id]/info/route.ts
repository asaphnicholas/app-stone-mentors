import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET(
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

    const { id } = await params

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/files/material/${id}/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao obter informações do arquivo' },
        { status: response.status }
      )
    }

    // Return the response from backend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('File info proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
