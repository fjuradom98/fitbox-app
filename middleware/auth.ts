import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../utils/jwt';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No se proporcionó token' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = verifyToken(token);
      // puedes guardar datos en req para uso posterior
      (req as any).user = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
}
