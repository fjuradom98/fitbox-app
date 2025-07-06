import { plans } from './db';
export async function obtenerPlanes() {
  return plans;
}
export async function crearPlan(data: any) {
  plans.push(data);
  return data;
}
