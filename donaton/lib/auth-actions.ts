'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch('http://127.0.0.1:8090/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: email,
        password: password 
      }),
    });

    if (!res.ok) return { error: "Credenciales inválidas" };

    const data = await res.json();
    const cookieStore = await cookies();

    // Normalización total del rol
    const userRole = data.rol?.trim().toUpperCase(); 

    // Guardar cookies
    cookieStore.set('token_acceso', data.token);
    cookieStore.set('user_name', data.nombre);
    cookieStore.set('user_role', userRole);

    // limpia cualquier rastro de la página anterior en el navegador
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');

  } catch (e) {
    return { error: "Error de conexión con el servidor" };
  }


  redirect('/admin'); 
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token_acceso');
  cookieStore.delete('user_name');
  cookieStore.delete('user_role');
  revalidatePath('/', 'layout');
  redirect('/login');
}