'use client';
import { NavbarGlobal } from 'donaton-ui-components';
import { useState } from 'react';
import { UsuarioModelo } from '@/modelo/usuarios';
import { Heart, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setCargando(true);

    const formData = new FormData(e.currentTarget);
    const user = formData.get('user') as string;
    const pass = formData.get('pass') as string;

    const respuesta = await UsuarioModelo.validarLoginCompleto(user, pass);

    if (respuesta?.token) {
      // Guardamos cookies con nombres consistentes
      document.cookie = `token_acceso=${respuesta.token}; path=/; max-age=7200; SameSite=Lax`;
      
      const role = respuesta.rol?.toString().toUpperCase().trim();
      document.cookie = `user_role=${role}; path=/; max-age=7200; SameSite=Lax`;
      
      const nombreUsuario = respuesta.username || user;
      document.cookie = `user_name=${encodeURIComponent(nombreUsuario)}; path=/; max-age=7200; SameSite=Lax`;
      
      // Redirección forzada según el ROL
      if (role === 'ADMIN') {
        window.location.assign("/admin"); 
      } else {
        window.location.assign("/");
      }
    } else {
      setError(true);
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mx-auto">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-blue-900">Donaton Access</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ingresa a la red de ayuda</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            {/* 🔥 Aquí añadimos text-slate-900 font-semibold y mantuvimos pl-11 */}
            <input name="user" placeholder="Email o Usuario" required className="w-full pl-11 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900 font-semibold placeholder:text-slate-400" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            {/* 🔥 Aquí también */}
            <input name="pass" type="password" placeholder="Contraseña" required className="w-full pl-11 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900 font-semibold placeholder:text-slate-400" />
          </div>
        </div>

        <button disabled={cargando} className="w-full bg-slate-900 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase transition disabled:opacity-50">
          {cargando ? 'Verificando...' : 'Iniciar Sesión'}
        </button>

        {error && <p className="text-red-500 text-center text-xs font-black uppercase italic animate-bounce">⚠️ Credenciales incorrectas</p>}

        <div className="pt-4 text-center border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            ¿No tienes una cuenta?{' '}
            <Link href="/registro" className="text-blue-600 hover:text-blue-800 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
}