// modelo/factory.ts

// Definimos la estructura base de un recurso
export interface Recurso {
  nombre: string;
  categoria: string;
  cantidad: number;
  procesar(): string;
}

// Clases específicas según tu diagrama
class Alimento implements Recurso {
  constructor(public nombre: string, public categoria: string, public cantidad: number) {}
  procesar() { return `Revisando fecha de caducidad del alimento: ${this.nombre}`; }
}

class InsumoMedico implements Recurso {
  constructor(public nombre: string, public categoria: string, public cantidad: number) {}
  procesar() { return `Almacenando con control de temperatura el insumo: ${this.nombre}`; }
}

class Ropa implements Recurso {
  constructor(public nombre: string, public categoria: string, public cantidad: number) {}
  procesar() { return `Clasificando por talla y sanitizando la ropa: ${this.nombre}`; }
}

// EL PATRÓN FACTORY METHOD
export class DonacionFactory {
  static crearRecurso(nombre: string, categoria: string, cantidad: number): Recurso {
    switch (categoria.toLowerCase()) {
      case 'alimentos':
        return new Alimento(nombre, categoria, cantidad);
      case 'insumos médicos':
        return new InsumoMedico(nombre, categoria, cantidad);
      case 'ropa':
        return new Ropa(nombre, categoria, cantidad);
      default:
        // Por defecto, lo tratamos como un recurso genérico (ej: Herramientas)
        return new Alimento(nombre, categoria, cantidad); 
    }
  }
}