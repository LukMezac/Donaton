'use client';

import { UsuarioModelo } from '@/modelo/usuarios';
import { UserPlus, Heart } from 'lucide-react';
import Link from 'next/link';

export default function RegistroPage() {

  async function handleRegistro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      usuario: formData.get("usuario") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const ok = await UsuarioModelo.registrar(payload);

    if (ok) {

      document.cookie =
        `user_name=${encodeURIComponent(payload.usuario)}; path=/; max-age=7200; SameSite=Lax`;

      alert("¡Cuenta creada con éxito! Ahora inicia sesión.");

      window.location.href = "/login";

    } else {
      alert("Error al registrar. Intenta con otros datos.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">

      <nav className="flex items-center justify-between px-10 py-6 bg-white border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
            <Heart
              className="text-white"
              size={20}
              fill="currentColor"
            />
          </div>

          <span className="text-2xl font-black tracking-tighter text-blue-700 uppercase italic">
            Donaton
          </span>
        </Link>
      </nav>

      <div className="flex items-center justify-center py-20 px-6">

        <form
          onSubmit={handleRegistro}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full max-w-md space-y-6 border border-slate-100"
        >

          <div className="text-center space-y-2">

            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-2">
              <UserPlus size={32} />
            </div>

            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
              Crear Cuenta
            </h2>

            <p className="text-sm font-medium text-slate-400">
              Únete como donador para ayudar en emergencias.
            </p>

          </div>

          <div className="space-y-4">

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Usuario
              </label>

              <input
                name="usuario"
                placeholder="Ej: nombre_apellido"
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="nombre@correo.com"
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Contraseña
              </label>

              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition shadow-xl shadow-blue-100 text-sm"
          >
            Registrarme Ahora
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-slate-500 font-medium">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-black uppercase italic hover:underline"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>

        </form>

      </div>

    </div>
  );
}