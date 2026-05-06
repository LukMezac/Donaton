import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { UsuarioModelo } from '../usuarios';

describe('Pruebas Unitarias - UsuarioModelo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debe retornar null si el login falla (Simulación)', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // Simulamos un fallo de red o credenciales incorrectas
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'No autorizado' }),
      } as any)
    ) as unknown as typeof fetch;

    const resultado = await UsuarioModelo.validarLoginCompleto('error', 'error');
    expect(resultado).toBeNull();
  });
});