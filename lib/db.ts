// lib/db.ts

import postgres from 'postgres';

// Usa la variable DATABASE_URL desde .env.local
const connectionString = process.env.DATABASE_URL as string;

// Inicializa la conexión
const sql = postgres(connectionString, {
  ssl: 'require' // ✅ IMPORTANTE para conectarte a Neon
});

export default sql;
