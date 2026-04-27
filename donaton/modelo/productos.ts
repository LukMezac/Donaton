const API_URL = "http://localhost:8090";

export const ProductoService = {

  async listar() {
    const res = await fetch(`${API_URL}/productos`, {
      cache: "no-store"
    });
    return res.json();
  },

  async crear(data: any) {
    const res = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  }
};