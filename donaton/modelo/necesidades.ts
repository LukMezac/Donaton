const API_URL = "http://localhost:8090/api";

export const NecesidadService = {
  async listar() {
    const res = await fetch(`${API_URL}/necesidades`, {
      cache: "no-store"
    });
    return res.json();
  },

  async crear(data: {
    ubicacion: string;
    descripcion: string;
    prioridad: string;
  }) {
    const res = await fetch(`${API_URL}/necesidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  }
};