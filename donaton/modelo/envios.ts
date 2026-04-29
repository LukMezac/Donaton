const URL = "http://localhost:8090/envios";

export const EnvioService = {
  async listar() {
    const res = await fetch(URL, { cache: "no-store" });
    return res.json();
  },

  async crear(data: any) {
    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async actualizar(id: number, data: any) {
    await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  // 🔥 ESTA ES LA QUE TE FALTA
  async actualizarEstado(id: number, estado: string) {
    await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
  },

  async eliminar(id: number) {
    await fetch(`${URL}/${id}`, {
      method: "DELETE",
    });
  },
};