import { query } from '@/lib/db';
import { DonacionFactory } from './factory'; // <-- Importamos tu patrón Factory

export const ProductoModelo = {
  async listar() {
    const res = await query('SELECT * FROM productos ORDER BY id DESC');
    return res.rows;
  },

  // Usamos el Factory antes de insertar en la BD
  async crear(nombre: string, categoria: string, cantidad: number) {
    
    // 1. Aplicamos el Patrón Factory Method (como en tu diagrama)
    const nuevoRecurso = DonacionFactory.crearRecurso(nombre, categoria, cantidad);
    
    // Aquí podrías imprimir en consola la lógica específica (opcional)
    console.log(nuevoRecurso.procesar()); 

    // 2. Aplicamos el Patrón Repository (Persistencia)
    const res = await query(
      'INSERT INTO productos (nombre, categoria, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [nuevoRecurso.nombre, nuevoRecurso.categoria, nuevoRecurso.cantidad]
    );
    return res.rows[0];
  },

  async actualizarCantidad(id: number, cantidad: number) {
    const res = await query('UPDATE productos SET cantidad = $1 WHERE id = $2 RETURNING *', [cantidad, id]);
    return res.rows[0];
  },

  async eliminar(id: number) {
    await query('DELETE FROM productos WHERE id = $1', [id]);
    return true;
  }
};