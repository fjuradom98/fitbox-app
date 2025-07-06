import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    switch (req.method) {
      case 'GET': {
        const [wod] = await sql`SELECT * FROM wods WHERE id = ${id}`;
        if (!wod) return res.status(404).json({ error: 'WOD no encontrado' });
        return res.status(200).json(wod);
      }

      case 'PUT': {
        const { fecha, titulo, descripcion } = req.body;
        const [actualizado] = await sql`
          UPDATE wods SET
            fecha = COALESCE(${fecha}, fecha),
            titulo = COALESCE(${titulo}, titulo),
            descripcion = COALESCE(${descripcion}, descripcion)
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(actualizado);
      }

      case 'DELETE': {
        const [borrado] = await sql`DELETE FROM wods WHERE id = ${id} RETURNING *`;
        if (!borrado) return res.status(404).json({ error: 'WOD no encontrado' });
        return res.status(200).json({ message: 'WOD eliminado', wod: borrado });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (err) {
    console.error('Error en /api/wod/[id]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
