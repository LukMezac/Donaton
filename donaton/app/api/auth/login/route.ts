import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 [API] Intentando login con:', email);

    // Extraer usuario del email: admin@donaton.cl -> admin
    let user = email;
    if (email.includes('@')) {
      user = email.split('@')[0];
    }

    console.log('🔐 [API] Usuario extraído:', user);

    const backendUrl = 'http://127.0.0.1:8090/auth/login';
    const payload = { user, pass: password };

    console.log('🔐 [API] Llamando a:', backendUrl);
    console.log('🔐 [API] Con payload:', payload);

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('🔐 [API] Backend respondió con status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('❌ [API] Error del backend:', errorText);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const data = await res.json();
    const token = data.token;
    
    console.log('✅ [API] Token recibido:', token.substring(0, 30) + '...');

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error: any) {
    console.error('🔥 [API] Error:', error.message);
    return NextResponse.json(
      { error: 'Error en el servidor: ' + error.message },
      { status: 500 }
    );
  }
}