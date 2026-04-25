import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'donaciones_db', // Cambia esto si tu DB tiene otro nombre
  password: 'Lukas.2424',
  port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);