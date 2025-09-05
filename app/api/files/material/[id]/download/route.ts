import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/files/material/${params.id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    })

    // If it's a file response, stream it with download headers
    if (response.ok) {
      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      const contentDisposition = response.headers.get('content-disposition') || 'attachment'
      
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': contentDisposition,
        },
      })
    }

    // Handle errors
    const errorData = await response.json().catch(() => ({}))
    return NextResponse.json(
      { message: errorData.message || 'Erro ao baixar arquivo' },
      { status: response.status }
    )

  } catch (error) {
    console.error('File download proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
