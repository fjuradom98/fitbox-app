import { users } from './db';
export async function crearUsuario(data: any) {
  users.push(data);
  return data;
}
export async function buscarUsuarioPorEmail(email: string) {
  return users.find(u => u.email === email);
}