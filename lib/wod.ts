import { wods } from './db';
export async function obtenerWODs() {
  return wods;
}
export async function crearWOD(data: any) {
  wods.push(data);
  return data;
}