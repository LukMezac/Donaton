const URL = "http://127.0.0.1:8090/necesidades";

export const NecesidadService = {

  // ✅ LISTAR (PÚBLICO)
  async listar(token?: string) {
    try {
      const headers: any = {
        'Content-Type': 'application/json'
      };

      // 👇 token opcional
      if (token && token !== "undefined") {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(URL, {
        cache: "no-store",
        headers
      });

      if (!res.ok) {
        console.error("❌ ERROR BACKEND:", res.status);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("🔥 FALLO FETCH NECESIDADES:", error);
      return [];
    }
  },

  // ✅ CREAR (USER o ADMIN)
  async crear(data: any, token?: string) {
    try {
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (token && token !== "undefined") {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("🔥 ERROR CREAR NECESIDAD:", error);
      throw error;
    }
  },

  // 🔒 SOLO ADMIN
  async actualizar(id: number, data: any, token: string) {
    const res = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Error al actualizar");
    return true;
  },

  // 🔒 SOLO ADMIN
  async eliminar(id: number, token: string) {
    const res = await fetch(`${URL}/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Error al eliminar");
    return true;
  },
  // ✅ CREAR (ESPECIAL MUNICIPAL)
  async crearMunicipal(data: any, token: string) {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // El token es obligatorio aquí
      };

      const res = await fetch(`${URL}/municipal`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("🔥 ERROR CREAR MUNICIPAL:", error);
      throw error;
    }
  },
};