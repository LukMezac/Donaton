import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { NecesidadService } from '../necesidades';

describe('Pruebas Unitarias - NecesidadService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debe retornar un arreglo vacío si el servidor falla', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('Error de conexión'))) as unknown as typeof fetch;
    
    const lista = await NecesidadService.listar();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBe(0);
  });
});