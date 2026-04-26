import { query } from '@/lib/db';

export const ProductoModelo = {
  async listar() {
    const res = await query('SELECT * FROM productos ORDER BY id DESC');
    return res.rows;
  },

  async crear(nombre: string, categoria: string, cantidad: number) {
    const res = await query(
      'INSERT INTO productos (nombre, categoria, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, categoria, cantidad]
    );
    return res.rows[0];
  },

  // NUEVO: Para actualizar el stock de un producto
  async actualizarCantidad(id: number, cantidad: number) {
    const res = await query(
      'UPDATE productos SET cantidad = $1 WHERE id = $2 RETURNING *',
      [cantidad, id]
    );
    return res.rows[0];
  },

  // NUEVO: Para borrar un producto del inventario
  async eliminar(id: number) {
    await query('DELETE FROM productos WHERE id = $1', [id]);
    return true;
  }
};