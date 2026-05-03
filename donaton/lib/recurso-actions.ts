'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = 'http://127.0.0.1:8090/recursos';

// Función para obtener el token de las cookies de forma segura
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token_acceso')?.value;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function eliminarRecursoAction(id: number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (res.ok) {
      revalidatePath('/admin');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function editarRecursoAction(id: number, datos: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(datos),
    });

    if (res.ok) {
      revalidatePath('/admin'); 
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al editar:", error);
    return false;
  }
}