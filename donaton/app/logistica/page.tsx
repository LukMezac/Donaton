import { EnvioService } from '@/modelo/envios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Truck, Plus, Clock, CheckCircle2, MapPin } from 'lucide-react';

export default async function LogisticaPage() {
  
  // 1. AUTENTICACIÓN
  const token = (await cookies()).get('token_acceso')?.value;
  if (!token) {
    redirect('/login');
  }

  // 2. OBTENER DATOS
  let envios: any[] = [];
  try {
    const data = await EnvioService.listar(token); // ✅ Ahora sí entrará a Java
    envios = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error cargando envíos:", error);
  }

  // 3. MATEMÁTICAS PARA LAS TARJETAS (Counters)
  const pendientes = envios.filter(e => e.estado === 'Pendiente').length;
  const enTransito = envios.filter(e => e.estado === 'En Tránsito').length;
  const entregados = envios.filter(e => e.estado === 'Entregado').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* NAVEGACIÓN */}
      <nav className="px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al Inicio
        </Link>
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <Truck size={20} />
          <span className="tracking-tight text-xl">Módulo de Logística</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6">
        
        {/* ENCABEZADO Y BOTÓN */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Control de Despachos
            </h1>
            <p className="text-slate-500 mt-2">
              Monitorea y coordina la distribución de los recursos almacenados.
            </p>
          </div>
          
          <Link href="/registro-logistica"> {/* Asegúrate de que esta sea la ruta de tu formulario */}
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              <Plus size={20} /> Registrar Salida
            </button>
          </Link>
        </div>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Pendientes */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendientes</p>
              <p className="text-3xl font-black text-slate-800">{pendientes}</p>
            </div>
          </div>

          {/* En Tránsito */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Truck size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">En Tránsito</p>
              <p className="text-3xl font-black text-slate-800">{enTransito}</p>
            </div>
          </div>

          {/* Entregados */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entregados</p>
              <p className="text-3xl font-black text-slate-800">{entregados}</p>
            </div>
          </div>
        </div>

        {/* TABLA DE RUTAS */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex items-center gap-2 text-slate-800 font-bold">
            <MapPin size={20} className="text-slate-400" />
            Rutas Activas e Historial
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-6 font-bold">ID</th>
                  <th className="p-6 font-bold">Destino</th>
                  <th className="p-6 font-bold">Transportista</th>
                  <th className="p-6 font-bold text-center">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 text-slate-700">
                {envios.length > 0 ? (
                  envios.map((envio) => (
                    <tr key={envio.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6 font-mono text-sm text-slate-400">#{envio.id}</td>
                      <td className="p-6 font-bold text-slate-800">{envio.destino}</td>
                      <td className="p-6 text-slate-500">{envio.transportista}</td>
                      <td className="p-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                          envio.estado === 'Pendiente' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          envio.estado === 'En Tránsito' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {envio.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-400 font-medium">
                      No hay despachos registrados aún.
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