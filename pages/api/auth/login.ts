import type { NextApiRequest, NextApiResponse } from 'next';
import { buscarUsuarioPorEmail } from '../../../lib/usuario';
import { signToken } from '../../../utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método no permitido');
  const { email, password } = req.body;
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario || usuario.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = signToken({ id: usuario.id, email, rol: usuario.rol });
  res.status(200).json({ token, usuario });
}