const API_URL = "http://localhost:8090/api";

export const EnvioService = {
  async listar() {
    const res = await fetch(`${API_URL}/envios`);
    return res.json();
  },

  async crear(data: any) {
    const res = await fetch(`${API_URL}/envios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  }
};