import Image from "next/image";
import Link from "next/link";
import { Heart, Truck, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { ProductoModelo } from '@/modelo/productos';
import AlertaDocker from '@/componentes/AlertaDocker';

export default async function Home() {
  try {
    // Verificación de salud del sistema con un tiempo límite (2 segundos)
    // Esto evita que el usuario espere eternamente si Docker está caído
    await Promise.race([
      ProductoModelo.listar(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("TIMEOUT")), 2000)
      )
    ]);

    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* Navegación */}
        <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Heart className="text-white" size={20} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-blue-700">Donaton</span>
          </div>
          
          <div className="hidden md:flex gap-10 text-sm font-semibold text-slate-500 items-center">
            <Link href="/lista-donaciones" className="hover:text-blue-600 transition cursor-pointer text-slate-800 font-bold">
              Donaciones
            </Link>
            <Link href="/logistica" className="hover:text-blue-600 transition cursor-pointer text-slate-800 font-bold">
              Logística
            </Link>
            <Link href="/necesidades" className="hover:text-blue-600 transition cursor-pointer text-slate-800 font-bold">
              Necesidades
            </Link>
          </div>
          
          <Link href="/login">
            <button className="bg-sky-100 text-sky-700 px-6 py-2 rounded-full text-sm font-bold hover:bg-sky-200 transition cursor-pointer">
              Portal Admin
            </button>
          </Link>
        </nav>

        <main className="max-w-6xl mx-auto px-6">
          {/* Sección Hero */}
          <header className="py-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-3/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100">
                <ShieldCheck size={14} /> Gestión de Ayuda Humanitaria
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Coordinación eficiente para <br />
                <span className="text-blue-600">situaciones de emergencia.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
                Plataforma para centralizar la gestión de recursos y optimizar la logística, 
                asegurando que la ayuda llegue oportunamente a las comunidades afectadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/vista-donaciones">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg shadow-blue-200 cursor-pointer">
                    Registrar Donación <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>

            <div className="md:w-2/5 flex justify-center">
              <div className="relative w-64 h-64 bg-sky-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <Heart size={100} className="text-sky-200" strokeWidth={1.5} />
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-50">
                  <Truck className="text-blue-500" size={32} />
                </div>
              </div>
            </div>
          </header>

          {/* Módulos principales */}
          <section className="py-20 grid md:grid-cols-3 gap-8 border-t border-slate-50">
            <div className="p-8 rounded-3xl border border-slate-100 bg-white">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Gestión de Donaciones</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Administra recursos, origen y centros de acopio asignados para cada donación recibida.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 bg-white">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Logística y Distribución</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Control de inventario, planificación de envíos y seguimiento hasta la entrega final.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 bg-white">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Necesidades en Terreno</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Reporte de recursos específicos y ubicación geográfica de los damnificados.
              </p>
            </div>
          </section>
        </main>

        <footer className="mt-20 py-10 text-center border-t border-slate-50">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Desarrollo Fullstack III | Duoc UC 2026
          </p>
        </footer>
      </div>
    );
  } catch (error: any) {
    // Si falla la conexión o hay timeout, mostramos la alerta visual
    return <AlertaDocker />;
  }
}