import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token_acceso')?.value;
  const rol = request.cookies.get('user_role')?.value;

  const { pathname } = request.nextUrl;

  // Si intenta entrar a /admin pero no tiene el token o no es ADMIN
  if (pathname.startsWith('/admin')) {
    if (!token || rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};