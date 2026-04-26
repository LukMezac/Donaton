import { ProductoModelo } from '@/modelo/productos';
import Link from 'next/link';
import { ArrowLeft, Package, Plus } from 'lucide-react';

export default async function ListaDonacionesPage() {
  // El Controlador llama al Modelo para obtener los datos
  const productos = await ProductoModelo.listar();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navegación Superior */}
      <nav className="px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al Inicio
        </Link>
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <Package size={20} />
          <span className="tracking-tight text-xl">Inventario de Donaton</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        
        {/* Encabezado de la página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Listado de Recursos</h1>
            <p className="text-slate-500 mt-2">Vista general del inventario almacenado en la base de datos.</p>
          </div>
          
          {/* Botón para ir al formulario de registro */}
          <Link href="/vista-donaciones">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              <Plus size={20} /> Nuevo Ingreso
            </button>
          </Link>
        </div>

        {/* Tarjeta con la Tabla de Datos */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-6 font-bold">Producto</th>
                  <th className="p-6 font-bold">Categoría</th>
                  <th className="p-6 font-bold text-center">Stock Disponible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {productos.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-semibold">{item.nombre}</td>
                    <td className="p-6 text-slate-500">{item.categoria}</td>
                    <td className="p-6 text-center">
                      <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
                        {item.cantidad} cant
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Mensaje por si la base de datos está vacía */}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-slate-400 font-medium">
                      No hay donaciones registradas en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
}