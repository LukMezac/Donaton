export const ProductoService = {

  async listar() {
    const res = await fetch('http://localhost:8090/productos');
    return res.json();
  },

  async eliminar(id: number) {
    await fetch(`http://localhost:8090/productos/${id}`, {
      method: 'DELETE'
    });
  },

  async actualizarCantidad(id: number, cantidad: number) {
    await fetch(`http://localhost:8090/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad })
    });
  }

};