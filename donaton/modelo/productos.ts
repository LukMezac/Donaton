import { query } from '../lib/db';

export interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  cantidad: number;
}

export const ProductoModelo = {
  async listar() {
    const res = await query('SELECT * FROM productos ORDER BY id DESC');
    return res.rows;
  },

  // NUEVA FUNCIÓN: Insertar producto
  async crear(nombre: string, categoria: string, cantidad: number) {
    const res = await query(
      'INSERT INTO productos (nombre, categoria, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, categoria, cantidad]
    );
    return res.rows[0];
  }
};