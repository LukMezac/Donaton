'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Truck, ClipboardList,
  RefreshCcw, Trash2, CheckCircle2, Search,
  Activity, ChevronRight, Edit3, Check
} from 'lucide-react';

// --- COMPONENTES Y FUNCIONES DE APOYO (Puestos arriba para evitar errores) ---

function NavItem({ icon, label, active, onClick, color }: any) {
    const colors: any = { 
      blue: 'text-blue-600 bg-blue-50', 
      rose: 'text-rose-600 bg-rose-50', 
      indigo: 'text-indigo-600 bg-indigo-50' 
    };
    return (
      <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-3xl font-extrabold text-sm transition-all group ${active ? colors[color] : 'text-slate-400 hover:bg-slate-50'}`}>
        <div className="flex items-center gap-4">{icon}{label}</div>
        <ChevronRight size={16} className={`transition-all ${active ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
      </button>
    );
}

function getBadgeStyle(vista: string, valor?: string) {
    if (valor === 'Entregado' || valor === 'Resuelto') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (valor === 'En Tránsito') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (valor === 'Pendiente' || valor === 'Alta') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-500 border-slate-200';
}

// --- COMPONENTE PRINCIPAL ---

const URLS = {
  INVENTARIO: 'http://127.0.0.1:8090/productos',
  NECESIDADES: 'http://127.0.0.1:8090/necesidades',
  LOGISTICA: 'http://127.0.0.1:8090/envios',
};

const ESTADOS_LOGISTICA = ['Pendiente', 'En Tránsito', 'Entregado'];

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'INVENTARIO' | 'NECESIDADES' | 'LOGISTICA'>('INVENTARIO');
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoValor, setNuevoValor] = useState<number>(0);

  const fetchData = async () => {
    setCargando(true);
    try {
      const token = document.cookie.split('; ').find(r => r.startsWith('token_acceso='))?.split('=')[1];
      const res = await fetch(URLS[vistaActiva], {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setCargando(false);
  };

  useEffect(() => { fetchData(); }, [vistaActiva]);

  // Ciclo para Logística
  const handleCicloLogistica = (id: number, estadoActual: string) => {
    const currentIndex = ESTADOS_LOGISTICA.indexOf(estadoActual || 'Pendiente');
    const nextIndex = (currentIndex + 1) % ESTADOS_LOGISTICA.length;
    const nuevoEstado = ESTADOS_LOGISTICA[nextIndex];
    setData(prev => prev.map(item => item.id === id ? { ...item, prioridad: nuevoEstado } : item));
  };

  // Ticket para Necesidades
  const handleResolverNecesidad = (id: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, estado: 'Resuelto', prioridad: 'Resuelto' } : item
    ));
  };

  const filteredData = data.filter(item => {
    const term = (item.nombre || item.descripcion || item.destino || '').toLowerCase();
    return term.includes(busqueda.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex text-slate-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex relative z-20">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Donaton</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Central</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          <NavItem icon={<Package size={22} />} label="Inventario" active={vistaActiva === 'INVENTARIO'} onClick={() => setVistaActiva('INVENTARIO')} color="blue" />
          <NavItem icon={<ClipboardList size={22} />} label="Necesidades" active={vistaActiva === 'NECESIDADES'} onClick={() => setVistaActiva('NECESIDADES')} color="rose" />
          <NavItem icon={<Truck size={22} />} label="Logística" active={vistaActiva === 'LOGISTICA'} onClick={() => setVistaActiva('LOGISTICA')} color="indigo" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        
        {/* TOPBAR - Letra oscura corregida */}
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-12 sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={`Filtrar ${vistaActiva.toLowerCase()}...`}
              className="w-[400px] pl-12 pr-6 py-3.5 bg-slate-100/50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button onClick={fetchData} className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-extrabold hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCcw size={18} className={cargando ? 'animate-spin' : ''} />
            Sincronizar Datos
          </button>
        </header>

        <div className="p-12 text-slate-900">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2 text-blue-600 font-black uppercase text-[10px] tracking-[0.2em]"><Activity size={16} /> Monitoreo en tiempo real</div>
              <h2 className="text-4xl font-black tracking-tight capitalize">{vistaActiva.toLowerCase()}</h2>
            </div>
            <div className="bg-white border border-slate-100 px-5 py-2.5 rounded-2xl text-xs font-black text-slate-400">{filteredData.length} REGISTROS</div>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-7 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Información General</th>
                  <th className="px-10 py-7 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Métrica / Estado</th>
                  <th className="px-10 py-7 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {!cargando && filteredData.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/40 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">{item.id}</div>
                          <div>
                            <div className="font-extrabold text-slate-800 text-lg">
                              {vistaActiva === 'LOGISTICA' ? (item.destino || "Destino Pendiente") : (item.nombre || item.descripcion || "Recurso")}
                            </div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase">
                              {vistaActiva === 'LOGISTICA' ? `Chofer: ${item.transportista || 'N/A'}` : 'Entidad del sistema'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-10 py-8 text-center">
                        {editandoId === item.id ? (
                           <input type="number" value={nuevoValor} onChange={(e) => setNuevoValor(Number(e.target.value))} className="w-24 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-xl outline-none text-center font-black text-blue-700" autoFocus />
                        ) : (
                          <button
                            onClick={() => vistaActiva === 'LOGISTICA' && handleCicloLogistica(item.id, item.prioridad)}
                            disabled={vistaActiva !== 'LOGISTICA'}
                            className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${vistaActiva === 'LOGISTICA' ? 'hover:scale-105 active:scale-95 cursor-pointer shadow-sm' : ''} ${getBadgeStyle(vistaActiva, item.prioridad || item.estado)}`}
                          >
                            {/* Ajuste para que diga Resuelto visualmente */}
                            {item.estado === 'Resuelto' || item.prioridad === 'Resuelto' 
                                ? '✅ Resuelto' 
                                : (item.stock ?? item.cantidad ?? item.prioridad ?? item.estado ?? '-')}
                            {vistaActiva === 'INVENTARIO' && item.estado !== 'Resuelto' ? ' UNID.' : ''}
                          </button>
                        )}
                      </td>

                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          {/* Lápiz para Inventario */}
                          {vistaActiva === 'INVENTARIO' && (
                             editandoId === item.id ? (
                                <button className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Check size={20} /></button>
                             ) : (
                                <button onClick={() => { setEditandoId(item.id); setNuevoValor(item.stock || item.cantidad || 0); }} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={20} /></button>
                             )
                          )}
                          {/* Ticket para Necesidades */}
                          {vistaActiva === 'NECESIDADES' && item.estado !== 'Resuelto' && (
                            <button onClick={() => handleResolverNecesidad(item.id)} className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle2 size={20} /></button>
                          )}
                          <button className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={20} /></button>
                        </div>
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