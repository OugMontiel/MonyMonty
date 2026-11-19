import {z} from "zod";
import {EDAD_MINIMA, GENEROS} from "./registroConstants.js";

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

export const claveSchema = z.string().min(8, {message: "La contraseña tiene mínimo 8 caracteres"});

// --- Registro por pasos ---

const nombreDe = (campo) =>
  z
    .string()
    .trim()
    .min(1, {message: `El ${campo} es obligatorio`})
    .min(3, {message: "Debe tener al menos 3 caracteres"});

export const nombreSchema = nombreDe("nombre");
export const apellidoSchema = nombreDe("apellido");

/** Fecha más reciente (YYYY-MM-DD) con la que una persona ya cumple la edad mínima. */
export function fechaMaximaNacimiento(hoy = new Date()) {
  const limite = new Date(hoy);
  limite.setFullYear(limite.getFullYear() - EDAD_MINIMA);
  const mes = String(limite.getMonth() + 1).padStart(2, "0");
  const dia = String(limite.getDate()).padStart(2, "0");
  return `${limite.getFullYear()}-${mes}-${dia}`;
}

export const fechaNacimientoSchema = z
  .string()
  .min(1, {message: "La fecha es obligatoria"})
  .refine((valor) => valor <= fechaMaximaNacimiento(), {message: `Debes ser mayor de ${EDAD_MINIMA} años`});

export const generoSchema = z.enum(GENEROS, {message: "Selecciona una opción"});

/** Requisitos de la clave nueva: alimentan el esquema y la lista de pasos que ve la persona. */
export const REQUISITOS_CLAVE = [
  {
    id: "largo",
    texto: "8 caracteres o más",
    pista: "Usa 8 caracteres o más",
    mensaje: "Debe tener al menos 8 caracteres",
    cumple: (valor) => valor.length >= 8,
  },
  {
    id: "mayuscula",
    texto: "Una mayúscula",
    pista: "Agrega una mayúscula",
    mensaje: "Debe contener al menos una mayúscula",
    cumple: (valor) => /[A-Z]/.test(valor),
  },
  {
    id: "numero",
    texto: "Un número",
    pista: "Agrega un número",
    mensaje: "Debe contener al menos un número",
    cumple: (valor) => /\d/.test(valor),
  },
  {
    id: "simbolo",
    texto: "Un símbolo",
    pista: "Agrega un símbolo para que sea más fuerte",
    mensaje: "Debe contener al menos un símbolo",
    cumple: (valor) => /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(valor),
  },
];

export const claveNuevaSchema = REQUISITOS_CLAVE.reduce(
  (schema, requisito) => schema.refine(requisito.cumple, {message: requisito.mensaje}),
  z.string().min(1, {message: "Crea una contraseña"})
);

export const confirmarClaveSchema = (clave) =>
  z
    .string()
    .min(1, {message: "Confirma tu contraseña"})
    .refine((valor) => valor === clave, {message: "Las contraseñas no coinciden"});

export const aceptaLegalSchema = z.boolean().refine((valor) => valor === true, {
  message: "Debes aceptar los términos y la política de privacidad para continuar",
});

/** Valida un solo valor contra un schema (para validar mientras se escribe). */
export function mensajeDe(schema, valor) {
  const res = schema.safeParse(valor);
  return res.success ? "" : res.error.issues[0].message;
}
