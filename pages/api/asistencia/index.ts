import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { usuario_id, fecha, hora_clase } = req.body;
      if (!usuario_id || !fecha || !hora_clase) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      try {
        const [asistencia] = await sql`
          INSERT INTO asistencias (usuario_id, fecha, hora_clase)
          VALUES (${usuario_id}, ${fecha}, ${hora_clase})
          RETURNING *
        `;
        return res.status(201).json(asistencia);
      } catch (err) {
        console.error('Error al registrar asistencia:', err);
        return res.status(500).json({ error: 'Error al registrar asistencia' });
      }
    }

    case 'GET': {
      try {
        const asistencias = await sql`SELECT * FROM asistencias`;
        return res.status(200).json(asistencias);
      } catch (err) {
        console.error('Error al obtener asistencias:', err);
        return res.status(500).json({ error: 'Error al obtener asistencias' });
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
