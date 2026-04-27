const API_URL = "http://localhost:8090";

export const NecesidadService = {

  async listar() {
    const res = await fetch(`${API_URL}/necesidades`, {
      cache: "no-store"
    });

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async crear(data: any) {
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