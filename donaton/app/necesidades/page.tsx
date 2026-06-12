import { NecesidadService } from '@/modelo/necesidades';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle2, Megaphone, Clock, Building } from 'lucide-react'; 
import { cookies } from 'next/headers'; 

export default async function NecesidadesPage() {
  
  // 🔥 1. OBTENER EL TOKEN Y EL ROL DIRECTAMENTE DESDE LAS COOKIES
  const cookieStore = await cookies();
  const token = cookieStore.get('token_acceso')?.value;
  const rolUsuario = cookieStore.get('user_role')?.value; 

  // 2. BLINDAJE: Consulta a la base de datos PASANDO EL TOKEN
  let necesidades: any[] = [];
  try {
    const data = await NecesidadService.listar(token); 
    necesidades = Array.isArray(data) ? data : [];
  } catch (error) {
    // ✅ EVITAMOS LA PANTALLA ROJA DE ERROR: Si falla (ej. 403), solo no carga datos.
    console.error("Error al cargar lista:", error);
    necesidades = []; 
  }

  // Server Action para CREAR
  async function reportarNecesidad(formData: FormData) {
    'use server';
    
    const cookieStoreAction = await cookies();
    const tokenAction = cookieStoreAction.get('token_acceso')?.value;
    const rolAction = cookieStoreAction.get('user_role')?.value;

    const ubicacionOriginal = formData.get('ubicacion') as string;
    const descripcion = formData.get('descripcion') as string;
    
    // 🔥 EL TRUCO NINJA: Etiquetamos el origen silenciosamente
    const ubicacionConEtiqueta = rolAction === 'MUNICIPAL' 
      ? `[MUNI] ${ubicacionOriginal}` 
      : `[USER] ${ubicacionOriginal}`;

    // Si es municipal, forzamos prioridad Alta automáticamente según requerimiento
    const prioridad = rolAction === 'MUNICIPAL' ? 'Alta' : formData.get('prioridad') as string;
    
    await NecesidadService.crear({ 
      ubicacion: ubicacionConEtiqueta, // ✅ Se guarda con la etiqueta secreta
      descripcion, 
      prioridad,
      estado: 'Pendiente'
    }, tokenAction);
    
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
            
            {/* 🔥 CABECERA DINÁMICA SEGÚN ROL */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rolUsuario === 'MUNICIPAL' ? 'bg-purple-50 text-purple-600' : 'bg-rose-50 text-rose-600'}`}>
                {rolUsuario === 'MUNICIPAL' ? <Building size={24} /> : <Megaphone size={24} />}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {rolUsuario === 'MUNICIPAL' ? 'Registro Oficial' : 'Reportar Alerta'}
              </h2>
            </div>

            <form action={reportarNecesidad} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ubicación</label>
                <input name="ubicacion" type="text" required placeholder="Ej: Sector Los Pinos" 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Descripción</label>
                <textarea name="descripcion" required placeholder="Ej: Agua y pañales..." rows={3}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white transition-all text-sm resize-none"></textarea>
              </div>
              
              {/* 🔥 OCULTAMOS LA PRIORIDAD PARA LA MUNI (ES ALTA POR DEFECTO) */}
              {rolUsuario !== 'MUNICIPAL' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prioridad</label>
                  <select name="prioridad" className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white transition-all text-sm">
                    <option value="Alta">Alta (Crítica)</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              )}

              {/* 🔥 BOTÓN DINÁMICO SEGÚN ROL */}
              <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg ${rolUsuario === 'MUNICIPAL' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}>
                {rolUsuario === 'MUNICIPAL' ? '🏛️ Documentar Necesidad' : '📢 Emitir Reporte'}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: Lista */}
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mapa de Necesidades</h1>
            <p className="text-slate-500 mt-2">Requerimientos actuales de centros de acopio.</p>
          </div>

          {necesidades.length === 0 ? (
             <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center text-slate-400 font-medium">
               No hay alertas activas o falta autenticación.
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
                      {/* 🔥 AQUÍ BORRAMOS LA ETIQUETA VISUALMENTE PARA QUE NO SE VEA FEO EN PANTALLA */}
                      <MapPin size={14}/> {item.ubicacion ? item.ubicacion.replace('[MUNI] ', '').replace('[USER] ', '').replace('[MUNI]', '').replace('[USER]', '') : ''}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{item.descripcion}</p>
                </div>
                
                <div>
                  {item.estado === 'Pendiente' ? (
                    <span className="px-4 py-2 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm flex items-center gap-2 border border-slate-200">
                      <Clock size={16} /> Pendiente
                    </span>
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