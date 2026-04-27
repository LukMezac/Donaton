const API_URL = "http://localhost:8090/api";

export const ProductoService = {
  async listar() {
    const res = await fetch(`${API_URL}/productos`);
    return res.json();
  },

  async crear(data: {
    nombre: string;
    categoria: string;
    cantidad: number;
  }) {
    const res = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async actualizarCantidad(id: number, cantidad: number) {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cantidad }),
    });

    return res.json();
  },

  async eliminar(id: number) {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });
  },
};