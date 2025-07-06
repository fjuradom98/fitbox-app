import type { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../../utils/jwt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = signToken({
    id: 1,
    nombre: 'Felipe Dev',
    email: 'felipe@example.com',
    rol: 'coach'
  });

  res.status(200).json({ token });
}
