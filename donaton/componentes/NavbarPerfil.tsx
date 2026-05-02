'use client';
import React from 'react';
import { 
  User, MapPin, CreditCard, Gift, RefreshCcw, 
  Heart, Settings, Smartphone, Landmark, LogOut, ChevronRight 
} from 'lucide-react';
import { logoutAction } from '@/lib/auth-actions'; // Importaremos la acción aquí

export default function NavbarPerfil() {
  const menuItems = [
    { icon: <User size={18} />, label: 'Datos personales', active: true },
    { icon: <MapPin size={18} />, label: 'Direcciones' },
    { icon: <CreditCard size={18} />, label: 'Medios de pago' },
    { icon: <Gift size={18} />, label: 'Gift Cards' },
    { icon: <RefreshCcw size={18} />, label: 'Datos para reembolso' },
    { icon: <Heart size={18} />, label: 'Mis listas' },
    { icon: <Settings size={18} />, label: 'Configurar mi cuenta' },
    { icon: <Smartphone size={18} />, label: 'Dispositivos vinculados' },
    { icon: <Landmark size={18} />, label: 'Pagar mi Donación' },
  ];

  return (
    <aside className="w-full md:w-80">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="py-2">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className={`w-full flex items-center justify-between p-4 transition-all border-b border-slate-50 last:border-0 ${
                item.active ? 'bg-slate-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 font-bold text-sm tracking-tight">
                <span className={item.active ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
              </div>
              <ChevronRight size={16} className={item.active ? 'text-blue-400' : 'text-slate-200'} />
            </button>
          ))}
          
          {/* BOTÓN DE CERRAR SESIÓN CON FORM ACTION */}
          <form action={logoutAction}>
            <button 
              type="submit"
              className="w-full flex items-center gap-3 p-6 text-red-600 bg-red-50/50 hover:bg-red-100 transition-colors mt-2 border-t border-red-50"
            >
              <LogOut size={18} />
              <span className="font-black text-sm uppercase tracking-widest">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}