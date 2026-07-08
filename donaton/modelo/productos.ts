const URL = "http://127.0.0.1:8090/productos";

export const ProductoService = {

  async listar(token?: string) {
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(URL, {
        cache: "no-store", // Asegura que siempre traiga datos frescos
        headers
      });

      if (!res.ok) throw new Error("Error al listar");
      return await res.json();

    } catch (error) {
      console.error("🔥 ERROR LISTAR:", error);
      return [];
    }
  },

  async crear(data: any, token: string) {
    try {
      console.log("📦 Enviando producto al backend:", data);

      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: data.nombre,
          categoria: data.categoria,
          cantidad: Number(data.cantidad),
          // Estos campos ahora se envían correctamente para ser persistidos
          origen: data.origen,
          fecha: data.fecha,
          centroAcopio: data.centroAcopio
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ ERROR CREAR:", res.status, text);
        throw new Error("Error al crear");
      }

      return await res.json();

    } catch (error) {
      console.error("🔥 ERROR CREAR PRODUCTO:", error);
      throw error;
    }
  }
};