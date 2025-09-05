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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const expiryHours = searchParams.get('expiry_hours') || '2'
    const queryString = `expiry_hours=${expiryHours}`

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/files/material/${params.id}?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
      redirect: 'manual', // Don't follow redirects automatically
    })

    // If backend returns a redirect, forward it
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (location) {
        return NextResponse.redirect(location)
      }
    }

    // If it's a file response, stream it
    if (response.ok) {
      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      const contentDisposition = response.headers.get('content-disposition')
      
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          ...(contentDisposition && { 'Content-Disposition': contentDisposition }),
        },
      })
    }

    // Handle errors
    const errorData = await response.json().catch(() => ({}))
    return NextResponse.json(
      { message: errorData.message || 'Erro ao acessar arquivo' },
      { status: response.status }
    )

  } catch (error) {
    console.error('File access proxy error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
