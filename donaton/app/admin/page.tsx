import { EnvioService } from '@/modelo/envios';
import { NecesidadService } from '@/modelo/necesidades';
import { ProductoService } from '@/modelo/productos';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Trash2, ArrowRightCircle, CheckCircle2, AlertTriangle, Truck, Package, RefreshCw } from 'lucide-react';

export default async function AdminPanelPage() {

  // 🔥 CARGA SEGURA DE DATOS
  let productos: any[] = [];
  let envios: any[] = [];
  let necesidades: any[] = [];

  try {
    const resProd = await ProductoService.listar();
    productos = Array.isArray(resProd) ? resProd : [];

    const resEnv = await EnvioService.listar();
    envios = Array.isArray(resEnv) ? resEnv : [];

    const resNec = await NecesidadService.listar();
    necesidades = Array.isArray(resNec) ? resNec : [];

  } catch (error) {
    console.error("Error cargando admin:", error);
  }

  // --- ACTIONS INVENTARIO ---
  async function actualizarStock(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);
    const cantidad = parseInt(formData.get('cantidad') as string);
    await ProductoService.actualizarCantidad(id, cantidad);
    revalidatePath('/admin');
    revalidatePath('/lista-donaciones');
  }

  async function eliminarProducto(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);
    await ProductoService.eliminar(id);
    revalidatePath('/admin');
    revalidatePath('/lista-donaciones');
  }

  // --- ACTIONS ENVÍOS ---
  async function avanzarEstadoEnvio(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);
    const actual = formData.get('estadoActual') as string;
    const nuevo = actual === 'Pendiente' ? 'En Tránsito' : 'Entregado';

    await EnvioService.actualizarEstado(id, nuevo);

    revalidatePath('/admin');
    revalidatePath('/logistica');
  }

  async function eliminarEnvio(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);
    await EnvioService.eliminar(id);

    revalidatePath('/admin');
    revalidatePath('/logistica');
  }

  // --- ACTIONS NECESIDADES ---
  async function resolverNecesidad(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);

    await NecesidadService.actualizar(
      id,
      formData.get('ubicacion') as string,
      formData.get('descripcion') as string,
      formData.get('prioridad') as string,
      'Resuelto'
    );

    revalidatePath('/admin');
    revalidatePath('/necesidades');
  }

  async function eliminarNecesidad(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);

    await NecesidadService.eliminar(id);

    revalidatePath('/admin');
    revalidatePath('/necesidades');
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">

      {/* NAV */}
      <nav className="px-8 py-6 bg-slate-900 text-white flex justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft size={18} /> Salir
        </Link>
        <div className="flex items-center gap-2 text-sky-400 font-bold">
          <ShieldAlert size={24} />
          <span>Admin Donaton</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6 space-y-16">

        {/* INVENTARIO */}
        <section>
          <h2 className="text-xl font-bold mb-4">Inventario</h2>

          <table className="w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Eliminar</th>
              </tr>
            </thead>

            <tbody>
              {productos.length > 0 ? (
                productos.map((p: any, i: number) => (
                  <tr key={p?.id ?? i}>
                    <td className="p-4">{p?.nombre ?? "-"}</td>
                    <td className="p-4">{p?.categoria ?? "-"}</td>

                    <td className="p-4">
                      <form action={actualizarStock} className="flex gap-2">
                        <input type="hidden" name="id" value={p.id} />
                        <input name="cantidad" defaultValue={p.cantidad} className="w-16 border p-1" />
                        <button><RefreshCw size={16} /></button>
                      </form>
                    </td>

                    <td className="p-4">
                      <form action={eliminarProducto}>
                        <input type="hidden" name="id" value={p.id} />
                        <button><Trash2 size={16} /></button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-6">Sin productos</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ENVÍOS */}
        <section>
          <h2 className="text-xl font-bold mb-4">Envíos</h2>

          <p>Total: {envios.length}</p>
        </section>

        {/* NECESIDADES */}
        <section>
          <h2 className="text-xl font-bold mb-4">Necesidades</h2>

          <p>Total: {necesidades.length}</p>
        </section>

      </main>
    </div>
  );
}