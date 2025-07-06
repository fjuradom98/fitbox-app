// pages/api/usuario/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const [usuario] = await sql`SELECT * FROM usuarios WHERE id = ${id}`;
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json(usuario);
      }

      case 'PUT': {
        const nombre = req.body.nombre ?? null;
        const correo = req.body.correo ?? null;
        const contrasena = req.body.contrasena ?? null;
        const rol = req.body.rol ?? null;
        const plan_id = req.body.plan_id ?? null;
      
        const [actualizado] = await sql`
          UPDATE usuarios
          SET
            nombre = COALESCE(${nombre}, nombre),
            correo = COALESCE(${correo}, correo),
            contrasena = COALESCE(${contrasena}, contrasena),
            rol = COALESCE(${rol}, rol),
            plan_id = COALESCE(${plan_id}, plan_id)
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(actualizado);
      }
      

      case 'DELETE': {
        const [borrado] = await sql`
          DELETE FROM usuarios
          WHERE id = ${id}
          RETURNING *
        `;
        if (!borrado) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json({ message: 'Usuario eliminado', usuario: borrado });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error('Error en /api/usuario/[id]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
