export const ProductoService = {

  async listar() {
    const res = await fetch('http://localhost:8090/productos');
    return res.json();
  },

  async crear(producto: any) {
    await fetch('http://localhost:8090/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });
  },

  async eliminar(id: number) {
    await fetch(`http://localhost:8090/productos/${id}`, {
      method: 'DELETE'
    });
  },

  async actualizarCantidad(id: number, cantidad: number) {
    await fetch(`http://localhost:8090/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cantidad })
    });
  }

};