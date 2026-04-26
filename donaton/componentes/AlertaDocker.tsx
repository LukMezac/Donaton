// componentes/AlertaDocker.tsx
import { DatabaseZap } from 'lucide-react';

export default function AlertaDocker() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border-t-4 border-rose-500">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <DatabaseZap size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Base de Datos Desconectada</h2>
        <p className="text-slate-500 mb-6">
          No pudimos establecer conexión con el servidor. Asegúrate de que los contenedores de 
          <span className="font-bold text-slate-800"> Docker Desktop </span> estén encendidos.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition"
        >
          Reintentar Conexión
        </button>
      </div>
    </div>
  );
}