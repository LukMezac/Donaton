import { query } from '@/lib/db';

export const NecesidadModelo = {
  async listar() {
    const res = await query('SELECT * FROM necesidades ORDER BY id DESC');
    return res.rows;
  },

  async crear(ubicacion: string, descripcion: string, prioridad: string) {
    const res = await query(
      'INSERT INTO necesidades (ubicacion, descripcion, prioridad, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [ubicacion, descripcion, prioridad, 'No Resuelto']
    );
    return res.rows[0];
  },

  // NUEVO: Para editar cualquier campo de la necesidad
  async actualizar(id: number, ubicacion: string, descripcion: string, prioridad: string, estado: string) {
    const res = await query(
      'UPDATE necesidades SET ubicacion = $1, descripcion = $2, prioridad = $3, estado = $4 WHERE id = $5 RETURNING *',
      [ubicacion, descripcion, prioridad, estado, id]
    );
    return res.rows[0];
  },

  // NUEVO: Para borrar reportes falsos o antiguos
  async eliminar(id: number) {
    await query('DELETE FROM necesidades WHERE id = $1', [id]);
    return true;
  }
};