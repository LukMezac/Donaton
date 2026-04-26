import { ProductoModelo } from '@/modelo/productos';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; // <-- Importamos redirect
import Link from 'next/link';
import { ArrowLeft, Heart, PackagePlus } from 'lucide-react';

export default async function RegistroDonacionPage() {
  
  async function registrarProducto(formData: FormData) {
    'use server';
    const nombre = formData.get('nombre') as string;
    const categoria = formData.get('categoria') as string;
    const cantidad = parseInt(formData.get('cantidad') as string);
    
    // 1. Ejecución del modelo MVC para guardar en Docker
    await ProductoModelo.crear(nombre, categoria, cantidad);
    
    // 2. Refrescar la caché de la lista de donaciones
    revalidatePath('/lista-donaciones');
    
    // 3. Redirigir al usuario directamente a la tabla para ver su producto
    redirect('/lista-donaciones'); 
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navegación de retorno Limpia */}
      <nav className="px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al Inicio
        </Link>
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <Heart size={20} fill="currentColor" />
          <span className="tracking-tight text-xl">Donaton</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto py-12 px-6">
        
        {/* Tarjeta Principal del Formulario */}
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* Encabezado del Formulario */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <PackagePlus size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nuevo Ingreso</h1>
              <p className="text-sm text-slate-500 mt-1">Registra los recursos recibidos para el inventario.</p>
            </div>
          </div>

          {/* Formulario Estilizado */}
          <form action={registrarProducto} className="space-y-6">
            
            {/* Producto */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Descripción del Producto</label>
              <input 
                name="nombre" 
                type="text" 
                placeholder="Ej: Mantas Polares" 
                required 
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-700" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label>
                <div className="relative">
                  <select 
                    name="categoria" 
                    className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="Alimentos">Alimentos</option>
                    <option value="Insumos Médicos">Insumos Médicos</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Higiene">Higiene</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad</label>
                <input 
                  name="cantidad" 
                  type="number" 
                  placeholder="0" 
                  required 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-700" 
                />
              </div>
            </div>

            {/* Centro de Acopio */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Centro de Acopio Asignado</label>
              <input 
                type="text" 
                placeholder="Ej: Sede Valparaíso" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-700" 
              />
            </div>

            {/* Botón de Acción */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 mt-4"
            >
              Registrar Donación
            </button>

          </form>
        </div>
        
      </main>
    </div>
  );
}