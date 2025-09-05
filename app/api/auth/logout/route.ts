import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token de autorização é obrigatório' },
        { status: 401 }
      )
    }

    // For JWT stateless, we just need to confirm logout
    // The client will discard tokens locally
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    // Even if backend returns error, we consider logout successful
    // since JWT is stateless and client will discard tokens
    const data = await response.json()

    // Return success response (client will handle token cleanup)
    return NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Logout proxy error:', error)
    // Even on error, return success since client will discard tokens
    return NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { status: 200 }
    )
  }
}
