import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret'; // clave para firmar/verificar tokens

// 🔒 Firmar un token con un payload (por ejemplo: el id del usuario)
export function signToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '1y' });
}

// ✅ Verificar un token recibido
export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
