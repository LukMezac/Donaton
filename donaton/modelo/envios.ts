import { query } from '@/lib/db';

export const EnvioModelo = {
  // 1. Obtener todos los despachos
  async listar() {
    const res = await query('SELECT * FROM envios ORDER BY id DESC');
    return res.rows;
  },

  // 2. Crear un nuevo despacho
  async crear(destino: string, transportista: string, estado: string) {
    const res = await query(
      'INSERT INTO envios (destino, transportista, estado) VALUES ($1, $2, $3) RETURNING *',
      [destino, transportista, estado]
    );
    return res.rows[0];
  },

  // 3. NUEVO: Actualizar el estado de un envío
  async actualizarEstado(id: number, nuevoEstado: string) {
    const res = await query(
      'UPDATE envios SET estado = $1 WHERE id = $2 RETURNING *',
      [nuevoEstado, id]
    );
    return res.rows[0];
  },

  // 4. NUEVO: Eliminar un envío
  async eliminar(id: number) {
    await query('DELETE FROM envios WHERE id = $1', [id]);
    return true;
  }
};