export const EnvioService = {

  async listar() {
    const res = await fetch('http://localhost:8090/envios');
    return res.json();
  },

  async crear(data: any) {
    await fetch('http://localhost:8090/envios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async actualizarEstado(id: number, estado: string) {
    await fetch(`http://localhost:8090/envios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
  },

  async eliminar(id: number) {
    await fetch(`http://localhost:8090/envios/${id}`, {
      method: 'DELETE'
    });
  }

};