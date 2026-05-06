// donaton/modelo/__tests__/factory.test.ts
import { describe, expect, it } from '@jest/globals';
import { DonacionFactory } from '../factory'; // Subimos un nivel con ../

describe('Pruebas Unitarias - DonacionFactory', () => {
  it('Debe asignar tipoCarga "PERECIBLE" a la categoría Alimentos', () => {
    const recurso = DonacionFactory.crearRecurso('Leche', 'Alimentos', 10);
    expect(recurso.tipoCarga).toBe('PERECIBLE');
  });

  it('Debe asignar tipoCarga "TEXTIL" a la categoría Ropa', () => {
    const recurso = DonacionFactory.crearRecurso('Pantalones', 'Ropa', 5);
    expect(recurso.tipoCarga).toBe('TEXTIL');
  });

  it('Debe asignar tipoCarga "GENERAL" a categorías no especificadas', () => {
    const recurso = DonacionFactory.crearRecurso('Martillo', 'Herramientas', 1);
    expect(recurso.tipoCarga).toBe('GENERAL');
  });
});