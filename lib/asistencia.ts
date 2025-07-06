import { attendances } from './db';
export async function obtenerAsistencias() {
  return attendances;
}
export async function crearAsistencia(data: any) {
  attendances.push(data);
  return data;
}