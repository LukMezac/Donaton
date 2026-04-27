export const UsuarioService = {
  async validarLogin(email: string, password: string) {
    if (email === "admin@donaton.cl" && password === "1234") {
      return { rol: "ADMIN" };
    }
    return null;
  }
};