const URL = "http://127.0.0.1:8090/envios"; 

export const EnvioService = {
  // LISTAR (público)
  async listar(token?: string) {
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(URL, { cache: "no-store", headers });
      return res.ok ? await res.json() : [];
    } catch (error) {
      return [];
    }
  },

  // CREAR: Requiere token obligatoriamente
  async crear(data: any, token: string) {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: No autorizado`);
    return await res.json();
  }
};