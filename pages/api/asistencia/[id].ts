import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    switch (req.method) {
      case 'GET': {
        const [asistencia] = await sql`SELECT * FROM asistencias WHERE id = ${id}`;
        if (!asistencia) return res.status(404).json({ error: 'Asistencia no encontrada' });
        return res.status(200).json(asistencia);
      }

      case 'PUT': {
        const { usuario_id, fecha, hora_clase } = req.body;
        const [actualizado] = await sql`
          UPDATE asistencias SET
            usuario_id = COALESCE(${usuario_id}, usuario_id),
            fecha = COALESCE(${fecha}, fecha),
            hora_clase = COALESCE(${hora_clase}, hora_clase)
          WHERE id = ${id}
          RETURNING *
        `;
        return res.status(200).json(actualizado);
      }

      case 'DELETE': {
        const [borrado] = await sql`DELETE FROM asistencias WHERE id = ${id} RETURNING *`;
        if (!borrado) return res.status(404).json({ error: 'Asistencia no encontrada' });
        return res.status(200).json({ message: 'Asistencia eliminada', asistencia: borrado });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (err) {
    console.error('Error en /api/asistencia/[id]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
