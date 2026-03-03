import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui-mude-em-producao'
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Valida formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Digite um email válido' },
        { status: 400 }
      );
    }

    // Aceita QUALQUER email válido (sem verificação de banco/arquivo)

    // Cria JWT token
    const token = await new SignJWT({ email: email.toLowerCase() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d') // Token válido por 30 dias
      .setIssuedAt()
      .sign(JWT_SECRET);

    // Cria resposta com cookie httpOnly
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        email: email.toLowerCase(),
      },
    });

    // Define cookie seguro
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('❌ Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
