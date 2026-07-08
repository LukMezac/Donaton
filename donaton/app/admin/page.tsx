'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Truck, ClipboardList, Users,
  RefreshCcw, Trash2, CheckCircle2, Search,
  Activity, ChevronRight, Edit3, Check, LogOut, Heart
} from 'lucide-react';

// --- COMPONENTES DE APOYO ---
function NavItem({ icon, label, active, onClick, color }: any) {
    const colors: any = { 
      blue: 'text-blue-600 bg-blue-50', 
      rose: 'text-rose-600 bg-rose-50', 
      indigo: 'text-indigo-600 bg-indigo-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return (
      <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-3xl font-extrabold text-sm transition-all group ${active ? colors[color] : 'text-slate-400 hover:bg-slate-50'}`}>
        <div className="flex items-center gap-4">{icon}{label}</div>
        <ChevronRight size={16} className={`transition-all ${active ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
      </button>
    );
}

function getBadgeStyle(vista: string, valor?: string) {
    const v = (valor || '').toLowerCase();
    if (v === 'entregado' || v === 'resuelto') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (v === 'en tránsito' || v === 'en transito') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (v === 'pendiente' || v === 'alta') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-500 border-slate-200';
}

const URLS = {
  INVENTARIO: 'http://127.0.0.1:8090/productos',
  NECESIDADES: 'http://127.0.0.1:8090/necesidades',
  LOGISTICA: 'http://127.0.0.1:8090/envios',
  USUARIOS: 'http://127.0.0.1:8090/usuarios', 
};

const ESTADOS_LOGISTICA = ['Pendiente', 'En Tránsito', 'Entregado'];

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'INVENTARIO' | 'NECESIDADES' | 'LOGISTICA' | 'USUARIOS'>('INVENTARIO');
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoValor, setNuevoValor] = useState<number>(0);

  const getToken = () =>
    document.cookie.split('; ').find(r => r.startsWith('token_acceso='))?.split('=')[1];

  const fetchData = async () => {
    setCargando(true);
    try {
      const res = await fetch(URLS[vistaActiva], {
        headers: { Authorization: `Bearer ${getToken()}` },
        cache: "no-store" 
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

  // 🚪 CERRAR SESIÓN
  const handleLogout = () => {
    const cookiesParaLimpiar = ['token_acceso', 'user_role', 'user_name'];
    cookiesParaLimpiar.forEach(cookie => {
      document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
    });
    localStorage.removeItem('userRole');
    window.location.replace("/login");
  };

  // 🗑️ ELIMINAR
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      const res = await fetch(`${URLS[vistaActiva]}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) await fetchData(); 
    } catch (e) {
      console.error("Error eliminar", e);
    }
  };

  // 👥 CAMBIAR ROL DE USUARIO
  const handleCambiarRol = async (id: number, nuevoRol: string) => {
    try {
      const res = await fetch(`${URLS.USUARIOS}/${id}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(nuevoRol) 
      });
      if (res.ok) {
        alert("Rol actualizado correctamente");
        await fetchData(); 
      }
    } catch (e) { console.error("Error al cambiar rol", e); }
  };

  // ✏️ EDITAR INVENTARIO
  const handleGuardarEdicion = async (item: any) => {
    try {
      const body = { ...item, stock: nuevoValor, cantidad: nuevoValor };
      const res = await fetch(`${URLS.INVENTARIO}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditandoId(null);
        await fetchData(); 
      }
    } catch (e) { console.error("Error editar", e); }
  };

  // ✅ RESOLVER NECESIDAD
  const handleResolverNecesidad = async (item: any) => {
    try {
      const body = { ...item, estado: 'Resuelto' };
      const res = await fetch(`${URLS.NECESIDADES}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) await fetchData(); 
    } catch (e) { console.error(e); }
  };

  // 🔄 CICLO LOGÍSTICA
  const handleCicloLogistica = async (item: any) => {
    const estadoActual = (item.estado || item.prioridad || 'pendiente').toLowerCase();
    const ESTADOS_MIN = ['pendiente', 'en tránsito', 'entregado'];
    const indexActual = ESTADOS_MIN.indexOf(estadoActual);
    const nextIndex = indexActual === -1 ? 1 : (indexActual + 1) % ESTADOS_LOGISTICA.length;
    const nuevoEstado = ESTADOS_LOGISTICA[nextIndex]; 

    const body = { ...item, estado: nuevoEstado, prioridad: nuevoEstado };
    try {
      const res = await fetch(`${URLS.LOGISTICA}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) await fetchData(); 
    } catch (e) { console.error(e); }
  };

  const filteredData = data.filter(item =>
    (item.nombre || item.descripcion || item.destino || item.email || '')
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex text-slate-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex relative z-20">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Heart className="text-white" size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800">Donaton</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-left">Admin Central</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          <NavItem icon={<Package size={22} />} label="Inventario" active={vistaActiva === 'INVENTARIO'} onClick={() => setVistaActiva('INVENTARIO')} color="blue" />
          <NavItem icon={<ClipboardList size={22} />} label="Necesidades" active={vistaActiva === 'NECESIDADES'} onClick={() => setVistaActiva('NECESIDADES')} color="rose" />
          <NavItem icon={<Truck size={22} />} label="Logística" active={vistaActiva === 'LOGISTICA'} onClick={() => setVistaActiva('LOGISTICA')} color="indigo" />
          <NavItem icon={<Users size={22} />} label="Usuarios" active={vistaActiva === 'USUARIOS'} onClick={() => setVistaActiva('USUARIOS')} color="purple" />
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-extrabold text-sm text-rose-500 hover:bg-rose-50 transition-all group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
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

        <div className="p-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2 text-blue-600 font-black uppercase text-[10px] tracking-[0.2em]"><Activity size={16} /> Monitoreo en tiempo real</div>
              <h2 className="text-4xl font-black tracking-tight capitalize">{vistaActiva.toLowerCase()}</h2>
            </div>
            <div className="bg-white border border-slate-100 px-5 py-2.5 rounded-2xl text-xs font-black text-slate-400">{filteredData.length} REGISTROS</div>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {vistaActiva === 'USUARIOS' ? 'Datos del Usuario' : 'Información General'}
                  </th>
                  <th className="px-10 py-7 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {vistaActiva === 'USUARIOS' ? 'Rol Actual' : 'Métrica / Estado'}
                  </th>
                  <th className="px-10 py-7 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {!cargando && filteredData.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/40 transition-all">
                      
                      {/* COLUMNA 1: INFORMACIÓN */}
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">{item.id}</div>
                          <div>
                            <div className="font-extrabold text-slate-800 text-lg capitalize">
                              {vistaActiva === 'LOGISTICA' ? (item.destino || "Destino Pendiente") : 
                               vistaActiva === 'USUARIOS' ? (item.nombre || "Sin Nombre") :
                               (item.nombre || item.descripcion || "Recurso")}
                            </div>
                            
                            {/* ETIQUETA INSTITUCIONAL */}
                            <div className={`text-[11px] font-bold uppercase mt-1 ${
                              vistaActiva === 'NECESIDADES' && (
                                (item.ubicacion || '').includes('[MUNI]') || 
                                (item.descripcion || '').toLowerCase().includes('muni') ||
                                (item.nombre || '').toLowerCase().includes('muni')
                              ) ? 'text-purple-600' : 'text-slate-400'
                            }`}>
                              {vistaActiva === 'LOGISTICA' ? `Chofer: ${item.transportista || 'N/A'}` : 
                               vistaActiva === 'USUARIOS' ? `Correo: ${item.email || 'N/A'}` :
                               vistaActiva === 'INVENTARIO' ? `Categoría: ${item.categoria || 'General'}` : 
                               vistaActiva === 'NECESIDADES' ? (
                                 
                                 // Si detecta la etiqueta o la palabra clave, pinta de morado
                                 (item.ubicacion || '').includes('[MUNI]') || 
                                 (item.descripcion || '').toLowerCase().includes('muni') || 
                                 (item.nombre || '').toLowerCase().includes('muni')
                                   ? '🏛️ SOLICITUD INSTITUCIONAL (MUNI)' :
                                 
                                 (item.ubicacion || '').includes('[USER]') 
                                   ? '📢 REPORTE CIUDADANO' :
                                 
                                 '⚠️ ALERTA DEL SISTEMA'
                               ) : 'Alerta del sistema'}
                            </div>

                            {/* 🔥 DATOS INVENTARIO */}
                            {vistaActiva === 'INVENTARIO' && (
                              <div className="text-[10px] font-bold text-slate-400 uppercase mt-1 flex gap-3">
                                <span>DONANTE: {item.origen || 'N/A'}</span>
                                <span>FECHA: {item.fecha || 'N/A'}</span>
                                <span>ACOPIO: {item.centroAcopio || 'N/A'}</span>
                              </div>
                            )}

                            {/* 🔥 NUEVOS DATOS NECESIDADES CON COLORES Y PILLS */}
                            {vistaActiva === 'NECESIDADES' && (
                              <div className="text-[10px] font-bold uppercase mt-2 flex items-center gap-2">
                                <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                  📍 SECTOR: {item.ubicacion || 'N/A'}
                                </span>
                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                  📦 CANTIDAD: {item.cantidad ?? 'N/A'}
                                </span>
                                <span className={`px-2 py-1 rounded-md ${
                                  (item.prioridad || '').toLowerCase() === 'alta' ? 'bg-rose-100 text-rose-700' :
                                  (item.prioridad || '').toLowerCase() === 'media' ? 'bg-amber-100 text-amber-700' :
                                  'bg-emerald-100 text-emerald-700'
                                }`}>
                                  ⚡ PRIORIDAD: {item.prioridad || 'NORMAL'}
                                </span>
                              </div>
                            )}

                          </div>
                        </div>
                      </td>
                      
                      {/* COLUMNA 2: ESTADO O SELECT DE ROLES */}
                      <td className="px-10 py-8 text-center">
                        {vistaActiva === 'USUARIOS' ? (
                          <select 
                            value={item.rol || 'USER'} 
                            onChange={(e) => handleCambiarRol(item.id, e.target.value)}
                            className="bg-purple-50 text-purple-700 border border-purple-200 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-purple-100 transition-all"
                          >
                            <option value="USER">👤 CIUDADANO</option>
                            <option value="MUNICIPAL">🏛️ MUNICIPAL</option>
                            <option value="ADMIN">⭐ ADMIN</option>
                          </select>
                        ) : editandoId === item.id ? (
                           <input type="number" value={nuevoValor} onChange={(e) => setNuevoValor(Number(e.target.value))} className="w-24 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-xl outline-none text-center font-black text-blue-700" autoFocus />
                        ) : (
                          <button
                            onClick={() => vistaActiva === 'LOGISTICA' && handleCicloLogistica(item)}
                            disabled={vistaActiva !== 'LOGISTICA'}
                            className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${vistaActiva === 'LOGISTICA' ? 'hover:scale-105 active:scale-95 cursor-pointer shadow-sm' : ''} ${getBadgeStyle(vistaActiva, item.prioridad || item.estado)}`}
                          >
                            {(item.estado || '').toLowerCase() === 'resuelto' 
                                ? '✅ Resuelto' 
                                : (item.stock ?? item.cantidad ?? item.prioridad ?? item.estado ?? '-')}
                            {vistaActiva === 'INVENTARIO' && (item.estado || '').toLowerCase() !== 'resuelto' ? ' UNID.' : ''}
                          </button>
                        )}
                      </td>

                      {/* COLUMNA 3: ACCIONES */}
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          {vistaActiva === 'INVENTARIO' && (
                             editandoId === item.id ? (
                                <button onClick={() => handleGuardarEdicion(item)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Check size={20} /></button>
                             ) : (
                                <button onClick={() => { setEditandoId(item.id); setNuevoValor(item.stock || item.cantidad || 0); }} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={20} /></button>
                             )
                          )}
                          {vistaActiva === 'NECESIDADES' && (item.estado || '').toLowerCase() !== 'resuelto' && (
                            <button onClick={() => handleResolverNecesidad(item)} className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle2 size={20} /></button>
                          )}
                          <button onClick={() => handleEliminar(item.id)} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={20} /></button>
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