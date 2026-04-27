import { EnvioService } from '@/modelo/envios';
import Link from 'next/link';
import { ArrowLeft, Truck, MapPin, CheckCircle, Clock, Plus, AlertCircle } from 'lucide-react';

export default async function LogisticaPage() {
  // Traemos los datos directamente desde PostgreSQL (Docker)
  const envios = await EnvioService.listar();

  // Calculamos los contadores dinámicamente leyendo la base de datos
  const pendientes = envios.filter((e: any) => e.estado === 'Pendiente').length;
  const transito = envios.filter((e: any) => e.estado === 'En Tránsito').length;
  const entregados = envios.filter((e: any) => e.estado === 'Entregado').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navegación Superior */}
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
        
        {/* Encabezado y Botón de Acción */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Control de Despachos</h1>
            <p className="text-slate-500 mt-2">Monitorea y coordina la distribución de los recursos almacenados.</p>
          </div>
          <Link href="/registro-logistica">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                  <Plus size={20} /> Registrar Salida
                </button>
          </Link>
        </div>

        {/* Tarjetas de Resumen (KPIs) calculadas dinámicamente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={28} /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Pendientes</p>
              <p className="text-3xl font-extrabold text-slate-900">{pendientes}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Truck size={28} /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">En Tránsito</p>
              <p className="text-3xl font-extrabold text-slate-900">{transito}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={28} /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Entregados</p>
              <p className="text-3xl font-extrabold text-slate-900">{entregados}</p>
            </div>
          </div>
        </div>

        {/* Tabla de Seguimiento Real */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold flex items-center gap-2"><MapPin size={20} className="text-slate-400"/> Rutas Activas e Historial</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 bg-white">
                <tr>
                  <th className="p-6 font-bold">ID Envío</th>
                  <th className="p-6 font-bold">Destino</th>
                  <th className="p-6 font-bold">Transportista</th>
                  <th className="p-6 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 bg-white">
                
                {/* Mensaje por si no hay despachos en la base de datos */}
                {envios.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-400 font-medium">
                      No hay despachos registrados aún.
                    </td>
                  </tr>
                )}

                {/* Mapeo de datos reales */}
                {envios.map((envio: any) => (
                  <tr key={envio.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 text-sm font-mono text-slate-400">ENV-{envio.id}</td>
                    <td className="p-6 font-semibold">{envio.destino}</td>
                    <td className="p-6 text-sm text-slate-500">{envio.transportista}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                        envio.estado === 'Entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        envio.estado === 'En Tránsito' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {envio.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
}