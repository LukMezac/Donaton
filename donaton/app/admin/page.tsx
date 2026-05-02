'use client';

import { useState, useEffect } from 'react';
import {
  Package, Trash2, Edit, RefreshCcw, Check,
  AlertCircle, Box, LayoutDashboard,
  ShoppingCart, HeartHandshake, ArrowRightLeft, ClipboardList, Truck
} from 'lucide-react';
import { eliminarRecursoAction, editarRecursoAction } from '@/lib/recurso-actions';

const URL_PRODUCTOS = 'http://127.0.0.1:8090/productos';

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<'INVENTARIO' | 'NECESIDADES' | 'Logística'>('INVENTARIO');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoStock, setNuevoStock] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setCargando(true);
    setError(null);
    try {
      const cookiesArr = document.cookie.split('; ');
      const token = cookiesArr.find(row => row.startsWith('token_acceso='))?.split('=')[1];

      if (!token) {
        setError('No hay token de acceso');
        setCargando(false);
        return;
      }

      // Fetch solo productos
      const res = await fetch(URL_PRODUCTOS, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        setError(`Error al traer productos: ${res.status}`);
        setData([]);
      } else {
        const productos = await res.json();
        setData(Array.isArray(productos) ? productos : []);
        console.log('✅ Productos cargados:', productos);
      }
    } catch (error) {
      console.error('❌ Error general:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setData([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrado según vista activa
  const itemsFiltrados = data;

  const stats = {
    donaciones: data.length,
    necesidades: 0,
    bajoStock: data.filter(i => Number(i.stock ?? 0) < 5).length,
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-2xl text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter uppercase italic text-slate-900">
              Donaton<span className="text-blue-600 font-black">HQ</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">
              Gestión Humanitaria
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
          title="Actualizar datos"
        >
          <RefreshCcw size={20} className={cargando ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-10 space-y-12">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard icon={<Box />} label="INVENTARIO" value={stats.donaciones} color="blue" />
          <StatCard icon={<ClipboardList />} label="NECESIDADES" value={stats.necesidades} color="orange" />
          <StatCard icon={<AlertCircle />} label="BAJO STOCK" value={stats.bajoStock} color="red" />
        </section>

        {/* TABS */}
        <div className="flex justify-start">
          <div className="flex bg-slate-200/50 p-1.5 rounded-[2rem] backdrop-blur-md">
            <TabControl
              active={vistaActiva === 'INVENTARIO'}
              onClick={() => setVistaActiva('INVENTARIO')}
              icon={<HeartHandshake size={18} />}
              title="Gestión de Donaciones"
            />
            <TabControl
              active={vistaActiva === 'NECESIDADES'}
              onClick={() => setVistaActiva('NECESIDADES')}
              icon={<ArrowRightLeft size={18} />}
              title="Panel de Necesidades"
            />
            <TabControl
              active={vistaActiva === 'Logística'}
              onClick={() => setVistaActiva('Logística')}
              icon={<Truck size={18} />}
              title="Panel de Logística"
            />
          </div>
        </div>

        {/* TABLE */}
        <section className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  RECURSO
                </th>
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                  CANTIDAD
                </th>
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {cargando ? (
                <tr>
                  <td colSpan={3} className="px-12 py-14 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCcw size={20} className="animate-spin" />
                      Cargando...
                    </div>
                  </td>
                </tr>
              ) : itemsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-12 py-14 text-center text-slate-400">
                    No hay elementos para mostrar.
                  </td>
                </tr>
              ) : (
                itemsFiltrados.map((item: any) => {
                  const cantidad = item.stock ?? item.cantidad ?? 0;

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/10 transition-all">
                      {/* RECURSO */}
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-6">
                          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                            <Package size={22} />
                          </div>
                          <span className="font-black text-slate-800 text-xl tracking-tighter capitalize">
                            {item.nombre}
                          </span>
                        </div>
                      </td>

                      {/* CANTIDAD */}
                      <td className="px-12 py-8 text-center">
                        {editandoId === item.id ? (
                          <input
                            type="number"
                            value={nuevoStock}
                            onChange={(e) => setNuevoStock(Number(e.target.value))}
                            className="w-20 bg-blue-50 border-2 border-blue-600 rounded-2xl px-2 py-2 text-center font-black text-blue-600"
                            autoFocus
                          />
                        ) : (
                          <div
                            className={`inline-flex flex-col items-center justify-center w-24 h-12 rounded-2xl font-black ${
                              Number(cantidad) < 5
                                ? 'bg-red-50 text-red-500 animate-pulse'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            <span className="text-lg leading-none">{cantidad}</span>
                            <span className="text-[8px] uppercase opacity-60 font-bold">Unid.</span>
                          </div>
                        )}
                      </td>

                      {/* ACCIONES */}
                      <td className="px-12 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          {editandoId === item.id ? (
                            <button
                              onClick={() =>
                                editarRecursoAction(item.id, { ...item, stock: nuevoStock }).then(() => {
                                  setEditandoId(null);
                                  fetchData();
                                })
                              }
                              className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all"
                              title="Guardar cambios"
                            >
                              <Check size={20} />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditandoId(item.id);
                                  setNuevoStock(Number(cantidad) || 0);
                                }}
                                className="p-4 bg-white text-slate-300 hover:text-blue-600 border border-slate-100 rounded-3xl transition-all"
                                title="Editar cantidad"
                              >
                                <Edit size={20} />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar "${item.nombre}"?`)) {
                                    eliminarRecursoAction(item.id).then(() => fetchData());
                                  }
                                }}
                                className="p-4 bg-white text-slate-300 hover:text-red-600 border border-slate-100 rounded-3xl transition-all"
                                title="Eliminar recurso"
                              >
                                <Trash2 size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

// STAT CARD COMPONENT
function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-600',
    orange: 'bg-orange-500',
    red: 'bg-red-600',
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex items-center gap-7">
      <div className={`p-6 rounded-[2rem] text-white ${colors[color]} shadow-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          {label}
        </p>
        <h3 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">
          {value}
        </h3>
      </div>
    </div>
  );
}

// TAB CONTROL COMPONENT
function TabControl({ active, onClick, icon, title }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-10 py-4 rounded-[1.8rem] text-[11px] font-black transition-all ${
        active
          ? 'bg-white text-slate-900 shadow-xl scale-105'
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon} {title}
    </button>
  );
}