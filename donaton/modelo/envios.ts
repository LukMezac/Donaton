import { query } from '@/lib/db';

export const EnvioModelo = {
  // Función para obtener todos los despachos
  async listar() {
    const res = await query('SELECT * FROM envios ORDER BY id DESC');
    return res.rows;
  },

  // Función para registrar un nuevo despacho
  async crear(destino: string, transportista: string, estado: string) {
    const res = await query(
      'INSERT INTO envios (destino, transportista, estado) VALUES ($1, $2, $3) RETURNING *',
      [destino, transportista, estado]
    );
    return res.rows[0];
  }
};