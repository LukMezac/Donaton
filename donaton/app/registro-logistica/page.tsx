import { EnvioService } from '@/modelo/envios';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 
import Link from 'next/link';
import { ArrowLeft, Truck, MapPin, Send } from 'lucide-react';

export default async function RegistroLogisticaPage() {
  
  async function registrarDespacho(formData: FormData) {
    'use server';

    // 🔥 1. OBTENER TOKEN JWT
    const token = (await cookies()).get('token_acceso')?.value;

    // 🔒 2. PROTECCIÓN: si no hay token → login
    if (!token) {
      redirect('/login');
    }

    // 3. Extraemos los datos
    const destino = formData.get('destino') as string;
    const transportista = formData.get('transportista') as string;

    // 4. Armamos el objeto
    const nuevoEnvio = {
      destino: destino,
      transportista: transportista,
      estado: "Pendiente" // Todo nuevo despacho empieza como pendiente
    };

    try {
      // ✅ ¡CORREGIDO!: Ahora pasamos el objeto Y EL TOKEN
      await EnvioService.crear(nuevoEnvio, token);
    } catch (error) {
      console.error("No se pudo registrar la salida:", error);
    }

    // 5. Refrescamos la tabla y volvemos
    revalidatePath('/logistica');
    redirect('/logistica');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* NAV */}
      <nav className="px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/logistica" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver a Logística
        </Link>
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <Truck size={20} />
          <span className="tracking-tight text-xl">Donaton</span>
        </div>
      </nav>

      {/* FORM */}
      <main className="max-w-xl mx-auto py-12 px-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Send size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Nuevo Despacho
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Asigna un destino y transportista para la ayuda.
              </p>
            </div>
          </div>

          {/* FORMULARIO */}
          <form action={registrarDespacho} className="space-y-6">
            
            {/* DESTINO */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Comunidad o Centro de Destino
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                <input
                  name="destino"
                  type="text"
                  placeholder="Ej: Campamento Viña del Mar"
                  required
                  className="w-full pl-11 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* TRANSPORTISTA */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Transportista / Vehículo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Truck size={18} className="text-slate-400" />
                </div>
                <input
                  name="transportista"
                  type="text"
                  placeholder="Ej: Furgón Patente AB-12-CD"
                  required
                  className="w-full pl-11 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 mt-4"
            >
              Registrar Salida de Ruta
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}