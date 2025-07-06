import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { fecha, titulo, descripcion } = req.body;
      if (!fecha || !titulo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      try {
        const [wod] = await sql`
          INSERT INTO wods (fecha, titulo, descripcion)
          VALUES (${fecha}, ${titulo}, ${descripcion ?? null})
          RETURNING *
        `;
        return res.status(201).json(wod);
      } catch (err) {
        console.error('Error al crear WOD:', err);
        return res.status(500).json({ error: 'Error al crear WOD' });
      }
    }

    case 'GET': {
      try {
        const wods = await sql`SELECT * FROM wods ORDER BY fecha DESC`;
        return res.status(200).json(wods);
      } catch (err) {
        console.error('Error al obtener WODs:', err);
        return res.status(500).json({ error: 'Error al obtener WODs' });
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
