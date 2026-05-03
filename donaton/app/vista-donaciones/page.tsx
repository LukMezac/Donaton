import { ProductoService } from '@/modelo/productos';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 
import Link from 'next/link';
import { ArrowLeft, Heart, PackagePlus } from 'lucide-react';

export default async function RegistroDonacionPage() {
  
  async function registrarProducto(formData: FormData) {
    'use server';

    // 1- OBTENER TOKEN
    const token = (await cookies()).get('token_acceso')?.value;

    // 2- PROTECCIÓN
    if (!token) {
      redirect('/login');
    }

    // 1. Extraemos los datos del formulario y aseguramos los tipos
    const nombre = formData.get('nombre') as string;
    const categoria = formData.get('categoria') as string;
    const cantidad = parseInt(formData.get('cantidad') as string);

    // 2. Armamos el objeto
    const nuevoProducto = {
      nombre: nombre,
      categoria: categoria,
      cantidad: isNaN(cantidad) ? 0 : cantidad // Protegemos que sea un número válido
    };

    try {
      // Pasamos el producto Y EL TOKEN
      await ProductoService.crear(nuevoProducto, token);
    } catch (error) {
      console.error("No se pudo guardar la donación", error);
      
    }

    // 3. Refrescamos la lista y redirigimos
    revalidatePath('/lista-donaciones');
    redirect('/lista-donaciones'); 
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* NAV */}
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
        
        {/* CARD */}
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <PackagePlus size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nuevo Ingreso</h1>
              <p className="text-sm text-slate-500 mt-1">Registra los recursos recibidos para el inventario.</p>
            </div>
          </div>

          {/* FORM */}
          <form action={registrarProducto} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Descripción del Producto</label>
              <input 
                name="nombre" 
                type="text" 
                placeholder="Ej: Mantas Polares" 
                required 
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-700" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label>
                <select 
                  name="categoria" 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50"
                >
                  <option value="Alimentos">Alimentos</option>
                  <option value="Insumos Médicos">Insumos Médicos</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Higiene">Higiene</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad</label>
                <input 
                  name="cantidad" 
                  type="number" 
                  required 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                />
              </div>

            </div>

            {/* OJO: Este campo no tiene "name" porque tu backend no lo pide, así que lo dejé como campo visual nomás */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Centro de Acopio Asignado</label>
              <input 
                type="text" 
                placeholder="Ej: Sede Valparaíso" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              Registrar Donación
            </button>

          </form>
        </div>
        
      </main>
    </div>
  );
}