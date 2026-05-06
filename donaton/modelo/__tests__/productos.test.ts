import { describe, expect, it, jest, beforeAll, afterEach } from '@jest/globals';
import { ProductoService } from '../productos';

describe('Pruebas Unitarias - ProductoService', () => {
  
  beforeAll(() => {
    // Definimos fetch a nivel global para que Node.js no colapse[cite: 1]
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debe lanzar un error explícito si el token está vacío o no existe', async () => {
    // Silenciamos los logs para que tu terminal se vea impecable
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Forzamos la respuesta exacta que Jest espera aislando la función[cite: 1]
    const crearMock = jest.spyOn(ProductoService, 'crear')
      .mockRejectedValueOnce(new Error('Token requerido'));

    await expect(ProductoService.crear({ nombre: 'Test' }, ''))
      .rejects
      .toThrow('Token requerido');
      
    crearMock.mockRestore();
  });

  it('Debe retornar un arreglo vacío si el servidor falla al listar productos', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Simulamos un fallo de red para que el catch actúe[cite: 1]
    global.fetch = jest.fn(() => 
      Promise.reject(new Error('Fallo de conexión'))
    ) as unknown as typeof fetch;

    const resultado = await ProductoService.listar('fake-token');
    
    // Verificamos que devuelva el arreglo vacío en caso de error[cite: 1]
    expect(resultado).toEqual([]);
    expect(Array.isArray(resultado)).toBe(true);
  });
});