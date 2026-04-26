import { NextResponse } from 'next/server';
import { ProductoModelo } from '@/modelo/productos';

// MÉTODO GET: Devuelve la lista de productos
export async function GET() {
  try {
    const productos = await ProductoModelo.listar();
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

// MÉTODO POST: Recibe datos y crea un nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, categoria, cantidad } = body;
    
    // Guardamos en la base de datos (Docker)
    const nuevoProducto = await ProductoModelo.crear(nombre, categoria, cantidad);
    
    // Devolvemos el producto recién creado
    return NextResponse.json(nuevoProducto);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}