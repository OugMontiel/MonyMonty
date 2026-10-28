import {z} from "zod";

/**
 * Reglas de validación del acceso. Son las mismas que ya usaban las vistas con
 * PrimeVue Forms; se centralizan aquí porque ahora el login, el registro por pasos
 * y el cambio de clave las comparten.
 */

const SIMBOLO = /[!@#$%^&*()_\-+=<>?{}[\]~]/;

export const emailSchema = z
  .string()
  .trim()
  .min(1, {message: "Por favor, ingresa tu correo electrónico."})
  .email({message: "Escribe un correo válido, por ejemplo contacto@monteflor.co"});

export const passwordSchema = z
  .string()
  .min(8, {message: "Debe tener al menos 8 caracteres"})
  .refine((v) => /[A-Z]/.test(v), {message: "Debe contener al menos una mayúscula"})
  .refine((v) => /\d/.test(v), {message: "Debe contener al menos un número"})
  .refine((v) => SIMBOLO.test(v), {message: "Debe contener al menos un símbolo"});

export const nombreSchema = (campo) =>
  z
    .string()
    .trim()
    .min(1, {message: `El ${campo} es obligatorio`})
    .min(3, {message: "Debe tener al menos 3 caracteres"});

/**
 * Valida `values` contra un z.object y devuelve el primer mensaje por campo.
 * @returns {{ok: boolean, errores: Record<string, string>}}
 */
export function validar(schema, values) {
  const res = schema.safeParse(values);
  if (res.success) return {ok: true, errores: {}};

  const errores = {};
  for (const issue of res.error.issues) {
    const campo = issue.path[0] ?? "_";
    if (!errores[campo]) errores[campo] = issue.message;
  }
  return {ok: false, errores};
}

/** Valida un solo valor contra un schema (para validar mientras se escribe). */
export function mensajeDe(schema, valor) {
  const res = schema.safeParse(valor);
  return res.success ? "" : res.error.issues[0].message;
}

/** Reglas de la clave y nivel de fortaleza para el medidor de 4 barras. */
export function fortalezaClave(clave) {
  const reglas = [
    {ok: clave.length >= 8, texto: "8 caracteres o más"},
    {ok: /[A-Z]/.test(clave), texto: "Una mayúscula"},
    {ok: /\d/.test(clave), texto: "Un número"},
    {ok: SIMBOLO.test(clave), texto: "Un símbolo"},
  ];
  const cumplidas = reglas.filter((r) => r.ok).length;

  let etiqueta = "Muy débil";
  let tono = "expense";
  if (clave) {
    if (cumplidas <= 1) [etiqueta, tono] = ["Débil", "expense"];
    else if (cumplidas === 2) [etiqueta, tono] = ["Regular", "warning"];
    else if (cumplidas === 3) [etiqueta, tono] = ["Buena", "warning"];
    else [etiqueta, tono] = [clave.length >= 12 ? "Muy fuerte" : "Fuerte", "income"];
  }
  return {reglas, nivel: clave ? Math.max(cumplidas, 1) : 0, etiqueta, tono};
}

/**
 * Convierte "DD/MM/AAAA" en Date (medianoche local, igual que el DatePicker anterior).
 * Devuelve null si el texto no es una fecha real.
 */
export function parseFecha(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return null;
  const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const fecha = new Date(a, mes - 1, d);
  const real = fecha.getFullYear() === a && fecha.getMonth() === mes - 1 && fecha.getDate() === d;
  return real ? fecha : null;
}

/** Da formato DD/MM/AAAA mientras se teclea (solo dígitos, barras automáticas). */
export function mascaraFecha(texto) {
  const d = texto.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Fecha límite para ser mayor de edad (hoy hace 18 años). */
export function fechaMinimaMayorDeEdad() {
  const f = new Date();
  f.setFullYear(f.getFullYear() - 18);
  return f;
}

/** "laura@correo.co" -> "la•••@correo.co" */
export function enmascararCorreo(email) {
  const [usuario = "", dominio = ""] = email.split("@");
  return `${usuario.slice(0, 2)}•••@${dominio}`;
}
