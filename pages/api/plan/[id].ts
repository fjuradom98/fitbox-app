import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    switch (req.method) {
      case 'GET': {
        const [plan] = await sql`SELECT * FROM planes WHERE id = ${id}`;
        if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
        return res.status(200).json(plan);
      }

      case 'PUT': {
        const { tipo, fecha_inicio, duracion_dias } = req.body;
        const [actualizado] = await sql`
          UPDATE planes SET
            tipo = COALESCE(${tipo}, tipo),
            fecha_inicio = COALESCE(${fecha_inicio}, fecha_inicio),
            duracion_dias = COALESCE(${duracion_dias}, duracion_dias)
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(actualizado);
      }

      case 'DELETE': {
        const [borrado] = await sql`DELETE FROM planes WHERE id = ${id} RETURNING *`;
        if (!borrado) return res.status(404).json({ error: 'Plan no encontrado' });
        return res.status(200).json({ message: 'Plan eliminado', plan: borrado });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (err) {
    console.error('Error en /api/plan/[id]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
