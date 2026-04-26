import { NecesidadModelo } from '@/modelo/necesidades';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle2, Megaphone } from 'lucide-react';

export default async function NecesidadesPage() {
  const necesidades = await NecesidadModelo.listar();

  // Server Action para guardar
  async function reportarNecesidad(formData: FormData) {
    'use server';
    const ubicacion = formData.get('ubicacion') as string;
    const descripcion = formData.get('descripcion') as string;
    const prioridad = formData.get('prioridad') as string;
    
    await NecesidadModelo.crear(ubicacion, descripcion, prioridad);
    revalidatePath('/necesidades');
  }

  // Server Action para resolver
  async function marcarResuelto(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string);
    await NecesidadModelo.resolver(id);
    revalidatePath('/necesidades');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al Inicio
        </Link>
        <div className="flex items-center gap-2 text-rose-600 font-bold">
          <AlertTriangle size={20} />
          <span className="tracking-tight text-xl">Módulo de Necesidades</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <Megaphone size={24} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Reportar Alerta</h2>
              </div>
            </div>

            <form action={reportarNecesidad} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ubicación Afectada</label>
                <input name="ubicacion" type="text" required placeholder="Ej: Sector Los Pinos" 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recursos Necesitados</label>
                <textarea name="descripcion" required placeholder="Ej: Se necesitan 50 bidones de agua y pañales..." rows={3}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white transition-all text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nivel de Prioridad</label>
                <select name="prioridad" className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white transition-all text-sm cursor-pointer">
                  <option value="Alta">Alta (Crítica)</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl hover:bg-rose-700 transition-all flex justify-center gap-2 mt-2 shadow-lg shadow-rose-200">
                Emitir Reporte
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: Lista de Necesidades */}
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mapa de Necesidades</h1>
            <p className="text-slate-500 mt-2">Requerimientos actuales levantados desde los centros de acopio y campamentos.</p>
          </div>

          {necesidades.length === 0 ? (
             <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center text-slate-400 font-medium">
               No hay alertas activas en este momento.
             </div>
          ) : (
            necesidades.map((item: any) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center group hover:border-rose-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.prioridad === 'Alta' ? 'bg-red-50 text-red-700 border-red-100' :
                      item.prioridad === 'Media' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      Prioridad {item.prioridad}
                    </span>
                    <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
                      <MapPin size={14}/> {item.ubicacion}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{item.descripcion}</p>
                </div>
                
                <div>
                  {item.estado === 'No Resuelto' ? (
                    <form action={marcarResuelto}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="px-4 py-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 font-bold rounded-xl transition-colors text-sm flex items-center gap-2">
                        <CheckCircle2 size={16} /> Marcar Resuelto
                      </button>
                    </form>
                  ) : (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm flex items-center gap-2 border border-emerald-100">
                      <CheckCircle2 size={16} /> Resuelto
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}