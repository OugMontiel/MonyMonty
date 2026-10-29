import {z} from "zod";

/**
 * Reglas de validación del acceso. Son las mismas que ya usaban las vistas con
 * PrimeVue Forms; se centralizan aquí porque ahora el login, el registro por pasos
 * y el cambio de clave las comparten.
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, {message: "Por favor, ingresa tu correo electrónico."})
  .email({message: "Escribe un correo válido, por ejemplo contacto@monteflor.co"});

/** Valida un solo valor contra un schema (para validar mientras se escribe). */
export function mensajeDe(schema, valor) {
  const res = schema.safeParse(valor);
  return res.success ? "" : res.error.issues[0].message;
}

