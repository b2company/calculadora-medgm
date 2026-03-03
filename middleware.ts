import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui-mude-em-producao'
);

// Rotas que precisam de autenticação
const protectedRoutes = ['/', '/resultado'];

// Rotas públicas (não precisam de autenticação)
const publicRoutes = ['/login', '/api'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite rotas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verifica se é uma rota protegida
  const isProtected = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verifica token de autenticação
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redireciona para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verifica se o token é válido
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Token inválido, redireciona para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo-medgm.png).*)',
  ],
};
