import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { tipo, fecha_inicio, duracion_dias } = req.body;
      if (!tipo || !fecha_inicio || !duracion_dias) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      try {
        const [plan] = await sql`
          INSERT INTO planes (tipo, fecha_inicio, duracion_dias)
          VALUES (${tipo}, ${fecha_inicio}, ${duracion_dias})
          RETURNING *
        `;
        return res.status(201).json(plan);
      } catch (err) {
        console.error('Error al crear plan:', err);
        return res.status(500).json({ error: 'Error al crear plan' });
      }
    }

    case 'GET': {
      try {
        const planes = await sql`SELECT * FROM planes`;
        return res.status(200).json(planes);
      } catch (err) {
        console.error('Error al obtener planes:', err);
        return res.status(500).json({ error: 'Error al obtener planes' });
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
