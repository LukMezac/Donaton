export function decodificarToken(token: string): any {
  try {
    // JWT tiene 3 partes separadas por puntos
    const partes = token.split('.');
    if (partes.length !== 3) throw new Error('Token inválido');

  
    const payload = partes[1];
    const decodificado = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    return decodificado;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

export function esAdmin(token: string): boolean {
  const decoded = decodificarToken(token);
  return decoded?.roles?.includes('ROLE_ADMIN') || false;
}