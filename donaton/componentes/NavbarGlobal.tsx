import { cookies } from 'next/headers';
import Link from 'next/link';
import { User, Heart, LayoutDashboard } from 'lucide-react';

export default async function NavbarGlobal() {
  // 1. Leemos las cookies de forma segura
  const cookieStore = await cookies();
  const token = cookieStore.get('token_acceso')?.value;
  const nombreUsuario = cookieStore.get('user_name')?.value || 'Usuario';
  
  // 🛡️ 2. Leemos el rol (asegúrate de guardarlo como 'user_role' al hacer login)
  const rol = cookieStore.get('user_role')?.value;

  return (
    <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-50 bg-white sticky top-0 z-50">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Heart className="text-white" size={20} fill="currentColor" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-blue-700">Donaton</span>
      </div>
      
      {/* LINKS CENTRALES */}
      <div className="hidden md:flex gap-10 text-sm font-semibold text-slate-500 items-center">
        <Link href="/lista-donaciones" className="hover:text-blue-600 transition text-slate-800 font-bold">
          Donaciones
        </Link>
        <Link href="/logistica" className="hover:text-blue-600 transition text-slate-800 font-bold">
          Logística
        </Link>
        <Link href="/necesidades" className="hover:text-blue-600 transition text-slate-800 font-bold">
          Necesidades
        </Link>
      </div>
      
      {/* SECCIÓN DERECHA DINÁMICA */}
      <div className="flex items-center gap-4">
        
        {/* 🛠️ BOTÓN PANEL ADMIN: Solo aparece si el token existe y el rol es ADMIN */}
        {token && rol === 'ADMIN' && (
          <Link href="/admin/dashboard" className="hidden lg:flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition-all">
            <LayoutDashboard size={16} />
            Panel Control
          </Link>
        )}

        {token ? (
          <Link href="/perfil" className="flex items-center gap-3 bg-slate-50 border border-slate-100 py-1.5 pl-4 pr-1.5 rounded-2xl hover:shadow-md transition-all group">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 leading-none mb-1">Mi Cuenta</p>
              <p className="text-xs font-bold text-slate-700">{nombreUsuario}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
          </Link>
        ) : (
          <Link href="/login">
            <button className="bg-sky-100 text-sky-700 px-6 py-2 rounded-full text-sm font-bold hover:bg-sky-200 transition">
              Portal Admin
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}