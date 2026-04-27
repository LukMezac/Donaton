export const NecesidadService = {

  async listar() {
    const res = await fetch('http://localhost:8090/necesidades');
    return res.json();
  },

  async crear(data: any) {
    await fetch('http://localhost:8090/necesidades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async eliminar(id: number) {
    await fetch(`http://localhost:8090/necesidades/${id}`, {
      method: 'DELETE'
    });
  },

  async actualizar(id: number, ubicacion: string, descripcion: string, prioridad: string, estado: string) {
    await fetch(`http://localhost:8090/necesidades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ubicacion,
        descripcion,
        prioridad,
        estado
      })
    });
  }

};