import NavbarPerfil from '@/componentes/NavbarPerfil';

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-black text-slate-900 mb-10 italic uppercase tracking-tighter">
          Mi perfil
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Componente que acabamos de crear */}
          <NavbarPerfil />

          {/* Área de Datos Personales */}
          <section className="flex-1">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
              <h2 className="text-xl font-black text-slate-800 mb-8 italic uppercase">
                Datos personales
              </h2>
              
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-slate-50 pb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Nombre y apellidos</p>
                    <p className="text-slate-700 font-bold text-lg">USUARIO</p>
                  </div>
                  <button className="text-blue-600 font-black text-sm hover:underline italic uppercase">Editar</button>
                </div>

                <div className="border-b border-slate-50 pb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Correo electrónico</p>
                  <p className="text-slate-700 font-bold text-lg">Correo@gmail.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}