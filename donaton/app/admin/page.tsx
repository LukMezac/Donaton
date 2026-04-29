import { EnvioService } from '@/modelo/envios';
import { NecesidadService } from '@/modelo/necesidades';
import { ProductoService } from '@/modelo/productos';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldAlert,
  Trash2,
  ArrowRightCircle,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Package,
  RefreshCw
} from 'lucide-react';

export default async function AdminPanelPage() {
  // 🔥 PROTECCIÓN PARA ERRORES
  let productos: any[] = [];
  let envios: any[] = [];
  let necesidades: any[] = [];

  try { productos = await ProductoService.listar(); } catch {}
  try { envios = await EnvioService.listar(); } catch {}
  try { necesidades = await NecesidadService.listar(); } catch {}

  productos = Array.isArray(productos) ? productos : [];
  envios = Array.isArray(envios) ? envios : [];
  necesidades = Array.isArray(necesidades) ? necesidades : [];

  // --- ACTIONS PARA INVENTARIO (DONACIONES) ---
  async function actualizarStock(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const cantidad = Number(formData.get('cantidad'));
    if (!isNaN(cantidad)) {
      await ProductoService.actualizarCantidad(id, cantidad);
      revalidatePath('/admin');
      revalidatePath('/lista-donaciones'); // Actualiza la vista pública
    }
  }

  async function eliminarProducto(formData: FormData) {
    'use server';
    await ProductoService.eliminar(Number(formData.get('id')));
    revalidatePath('/admin');
    revalidatePath('/lista-donaciones');
  }

  // --- ACTIONS PARA LOGÍSTICA ---
  async function avanzarEstadoEnvio(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const actual = formData.get('estadoActual') as string;
    let nuevo = actual === 'Pendiente' ? 'En Tránsito' : 'Entregado';
    await EnvioService.actualizarEstado(id, nuevo);
    revalidatePath('/admin');
    revalidatePath('/logistica');
  }

  async function eliminarEnvio(formData: FormData) {
    'use server';
    await EnvioService.eliminar(Number(formData.get('id')));
    revalidatePath('/admin');
    revalidatePath('/logistica');
  }

  // --- ACTIONS PARA NECESIDADES ---
  async function resolverNecesidad(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    await NecesidadService.actualizar(id, {
          ubicacion: formData.get('ubicacion') as string,
          descripcion: formData.get('descripcion') as string,
          prioridad: formData.get('prioridad') as string,
          estado: formData.get('estado') as string
        });
    revalidatePath('/admin');
    revalidatePath('/necesidades');
  }

  async function eliminarNecesidad(formData: FormData) {
    'use server';
    await NecesidadService.eliminar(Number(formData.get('id')));
    revalidatePath('/admin');
    revalidatePath('/necesidades');
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      <nav className="px-8 py-6 bg-slate-900 text-white sticky top-0 z-50 flex items-center justify-between shadow-xl">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold text-sm transition group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Salir
        </Link>
        <div className="flex items-center gap-2 font-bold text-sky-400">
          <ShieldAlert size={24} />
          <span className="tracking-tighter text-2xl uppercase">Admin Donaton</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6 space-y-16">
        
        {/* CARDS DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Productos Registrados</p>
            <p className="text-4xl font-black text-indigo-600 mt-2">{productos.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Envíos Activos</p>
            <p className="text-4xl font-black text-blue-600 mt-2">{envios.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Alertas Reportadas</p>
            <p className="text-4xl font-black text-rose-600 mt-2">{necesidades.length}</p>
          </div>
        </div>

        {/* SECCIÓN 1: GESTIÓN DE INVENTARIO */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 text-white rounded-lg"><Package size={20}/></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Inventario de Donaciones</h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="p-6">Producto</th>
                  <th className="p-6">Categoría</th>
                  <th className="p-6 text-center">Editar Stock</th>
                  <th className="p-6 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productos.map((prod: any) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50">
                    <td className="p-6 font-bold text-slate-800">{prod.nombre}</td>
                    <td className="p-6 text-xs text-slate-500">{prod.categoria}</td>
                    <td className="p-6">
                      {/* Formulario rápido para editar la cantidad */}
                      <form action={actualizarStock} className="flex items-center justify-center gap-2">
                        {/* BLINDAJE: Convertimos los IDs numéricos a String para evitar errores de React */}
                        <input type="hidden" name="id" value={String(prod.id)} />
                        <input 
                          type="number" 
                          name="cantidad" 
                          defaultValue={prod.cantidad} 
                          className="w-20 p-2 text-center border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500" 
                        />
                        <button type="submit" title="Actualizar Stock" className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition">
                          <RefreshCw size={16} />
                        </button>
                      </form>
                    </td>
                    <td className="p-6 flex justify-center">
                      <form action={eliminarProducto}>
                        <input type="hidden" name="id" value={String(prod.id)} />
                        <button type="submit" className="p-2 text-slate-300 hover:text-red-600 transition"><Trash2 size={18}/></button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECCIÓN 2: GESTIÓN DE LOGÍSTICA */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 text-white rounded-lg"><Truck size={20}/></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Control de Envíos</h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="p-6">ID</th>
                  <th className="p-6">Destino / Transportista</th>
                  <th className="p-6">Estado Actual</th>
                  <th className="p-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {envios.map((envio: any) => (
                  <tr key={envio.id} className="hover:bg-slate-50/50">
                    <td className="p-6 font-mono text-xs text-slate-400">#E{envio.id}</td>
                    <td className="p-6">
                      <p className="font-bold text-slate-800">{envio.destino}</p>
                      <p className="text-xs text-slate-500">{envio.transportista}</p>
                    </td>
                    <td className="p-6">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-black border border-blue-100 uppercase">{envio.estado}</span>
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      {envio.estado !== 'Entregado' && (
                        <form action={avanzarEstadoEnvio}>
                          <input type="hidden" name="id" value={String(envio.id)} />
                          <input type="hidden" name="estadoActual" value={envio.estado} />
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-2">
                            Avanzar <ArrowRightCircle size={14}/>
                          </button>
                        </form>
                      )}
                      <form action={eliminarEnvio}>
                        <input type="hidden" name="id" value={String(envio.id)} />
                        <button className="p-2 text-slate-300 hover:text-red-600 transition"><Trash2 size={18}/></button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECCIÓN 3: GESTIÓN DE NECESIDADES */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-600 text-white rounded-lg"><AlertTriangle size={20}/></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Gestión de Necesidades</h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="p-6">Ubicación / Descripción</th>
                  <th className="p-6 text-center">Prioridad</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {necesidades.map((n: any) => (
                  <tr key={n.id} className="hover:bg-slate-50/50">
                    <td className="p-6 max-w-xs">
                      <p className="font-bold text-slate-800">{n.ubicacion}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{n.descripcion}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${n.prioridad === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500'}`}>
                        {n.prioridad}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`text-xs font-bold ${n.estado === 'Resuelto' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {n.estado}
                      </span>
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      {n.estado !== 'Resuelto' && (
                        <form action={resolverNecesidad}>
                          <input type="hidden" name="id" value={String(n.id)} />
                          <input type="hidden" name="ubicacion" value={n.ubicacion || ''} />
                          <input type="hidden" name="descripcion" value={n.descripcion || ''} />
                          <input type="hidden" name="prioridad" value={n.prioridad || ''} />
                          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2">
                            Resolver <CheckCircle2 size={14}/>
                          </button>
                        </form>
                      )}
                      <form action={eliminarNecesidad}>
                        <input type="hidden" name="id" value={String(n.id)} />
                        <button className="p-2 text-slate-300 hover:text-red-600 transition"><Trash2 size={18}/></button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}