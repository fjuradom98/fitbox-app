import type { NextApiRequest, NextApiResponse } from 'next';
import { crearUsuario, buscarUsuarioPorEmail } from '../../../lib/usuario';
import { signToken } from '../../../utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método no permitido');

  const { nombre, email, password, rol } = req.body;
  const existe = await buscarUsuarioPorEmail(email);
  if (existe) return res.status(400).json({ error: 'Ya existe el usuario' });

  const nuevoUsuario = await crearUsuario({ id: Date.now(), nombre, email, password, rol });
  const token = signToken({ id: nuevoUsuario.id, email, rol });
  res.status(201).json({ token, usuario: nuevoUsuario });
}