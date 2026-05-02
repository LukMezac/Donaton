const BASE_URL = "http://localhost:8090/auth";

export const UsuarioModelo = {

  // 🔐 LOGIN COMPLETO
  async validarLoginCompleto(username: string, password: string) {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      // ❌ Error HTTP
      if (!res.ok) {
        const error = await res.json();
        console.error("Error login:", error);
        return null;
      }

      // ✅ Respuesta correcta
      const data = await res.json();

      /*
        data = {
          token: "...",
          rol: "USER" | "ADMIN",
          nombre: "..."
        }
      */

      return data;

    } catch (error) {
      console.error("Error conexión login:", error);
      return null;
    }
  },

  // 🧾 REGISTRO
  async registrar(datos: { usuario: string; email: string; password: string }) {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error registro:", error);
        return false;
      }

      return true;

    } catch (error) {
      console.error("Error conexión registro:", error);
      return false;
    }
  }

};