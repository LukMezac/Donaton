import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Si alguien intenta entrar a /admin...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // El Middleware busca la cookie que creamos en el Login
    const token = request.cookies.get('token_acceso')?.value;

    // Si NO hay token válido, lo pateamos a la página de Login
    if (!token || token !== 'sesion-valida-admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Proteger todo lo que esté en /admin
};