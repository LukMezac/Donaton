import { query } from '@/lib/db';

export const UsuarioModelo = {
  async validarLogin(email: string, password: string) {
    // En un sistema real la contraseña estaría encriptada, 
    // pero para el MVP usaremos texto plano para probar rápido.
    const res = await query(
      'SELECT id, email, rol FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );
    return res.rows[0]; // Devuelve el usuario si existe, o undefined si se equivocó
  }
};