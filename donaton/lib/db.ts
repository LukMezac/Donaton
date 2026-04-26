// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'donaciones_db',
  password: 'Lukas.2424',
  port: 5432,
  connectionTimeoutMillis: 2000, // 2 segundos máximo para conectar
});

export const query = async (text: string, params?: any[]) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("❌ Fallo en Base de Datos:", error);
    // Lanzamos el error para que lo atrape el error.tsx
    throw new Error("DB_CONNECTION_FAILED");
  }
};