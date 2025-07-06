// pages/api/usuario/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { nombre, correo, contrasena, rol, plan_id } = req.body;

      if (!nombre || !correo || !contrasena || !rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      try {
        const [nuevoUsuario] = await sql`
          INSERT INTO usuarios (nombre, correo, contrasena, rol, plan_id)
          VALUES (${nombre}, ${correo}, ${contrasena}, ${rol}, ${plan_id ?? null})
          RETURNING *
        `;
        return res.status(201).json(nuevoUsuario);
      } catch (err) {
        console.error('Error al crear usuario:', err);
        return res.status(500).json({ error: 'Error al crear usuario' });
      }
    }

    case 'GET': {
      try {
        const usuarios = await sql`SELECT * FROM usuarios`;
        return res.status(200).json(usuarios);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
