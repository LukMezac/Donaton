import { UsuarioModelo } from '@/modelo/usuarios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  
  async function iniciarSesion(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const usuario = await UsuarioModelo.validarLogin(email, password);

    if (usuario) {
      // 1. Esperamos las cookies y luego creamos el token (Sintaxis Next.js 15+)
      const cookieStore = await cookies();
      
      cookieStore.set('token_acceso', 'sesion-valida-admin', {
        httpOnly: true, // Seguro contra ataques
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2, // Dura 2 horas
        path: '/',
      });
      
      // 2. Lo mandamos al portal admin
      redirect('/admin');
    } else {
      // Aquí podrías manejar el error, pero por ahora recargamos
      redirect('/login?error=credenciales');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Acceso Restringido</h1>
          <p className="text-slate-500 text-sm mt-2">Ingresa tus credenciales de administrador.</p>
        </div>

        <form action={iniciarSesion} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Electrónico</label>
            <input 
              name="email" 
              type="email" 
              placeholder="admin@donaton.cl" 
              required 
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-slate-50" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-slate-50" 
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition">
            Iniciar Sesión
          </button>
        </form>
        
        <Link href="/" className="mt-6 flex justify-center items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition">
          <ArrowLeft size={16} /> Volver al portal público
        </Link>
      </div>
    </div>
  );
}