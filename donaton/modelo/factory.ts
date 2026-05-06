// donaton/modelo/factory.ts

export interface Recurso {
  nombre: string;
  categoria: string;
  cantidad: number;
  tipoCarga: string;
}

export class DonacionFactory {
  static crearRecurso(nombre: string, categoria: string, cantidad: number): Recurso {
    let tipoCarga = "GENERAL";

    // Lógica de negocio del Factory
    if (categoria === "Alimentos") {
      tipoCarga = "PERECIBLE";
    } else if (categoria === "Insumos Médicos") {
      tipoCarga = "FRÁGIL";
    } else if (categoria === "Ropa") {
      tipoCarga = "TEXTIL";
    }

    return {
      nombre,
      categoria,
      cantidad,
      tipoCarga
    };
  }
}