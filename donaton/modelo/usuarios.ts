export const UsuarioModelo = {
  async validarLogin(email: string, password: string) {

    if (email === "admin@donaton.cl" && password === "admin123") {
      return { id: 1, email, rol: "admin" };
    }

    return null;
  }
};