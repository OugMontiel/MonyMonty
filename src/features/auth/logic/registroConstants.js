// Constantes del registro por pasos (CrearCuentaView.vue, PasoPlan.vue, PasosRegistro.vue)

export const EDAD_MINIMA = 18;
export const TRIAL_DIAS = 14;

export const PASOS_REGISTRO = ["Tus datos", "Acceso", "Plan"];

// Campos que se validan antes de avanzar desde cada paso
export const CAMPOS_PASO = {
  1: ["nombre", "apellido", "fechaNacimiento", "genero"],
  2: ["email", "clave", "confirmar", "acepta"],
};

export const GENEROS = ["Femenino", "Masculino"];

// Se indexa por la cantidad de requisitos de la clave que ya se cumplen (0 a 4)
export const NIVELES_CLAVE = [
  {texto: "Muy débil", tono: "expense"},
  {texto: "Débil", tono: "expense"},
  {texto: "Regular", tono: "balance"},
  {texto: "Buena", tono: "income"},
  {texto: "Fuerte", tono: "income"},
];

export const PERIODOS = [
  {id: "mensual", etiqueta: "Mensual"},
  {id: "anual", etiqueta: "Anual · ahorra 28 %"},
];

// Solo se ofrecen Free y Basic al crear la cuenta
export const PLANES_REGISTRO = [
  {
    id: "free",
    nombre: "Free",
    icono: "ion:wallet-outline",
    tono: "neutro",
    gratis: true,
    descripcion: "Para ordenar lo básico y crear el hábito.",
    caracteristicas: ["Movimientos, gastos e ingresos", "Hasta 3 cuentas", "Tablero y categorías", "Aprende · nivel 1"],
  },
  {
    id: "basic",
    nombre: "Basic",
    icono: "ion:rocket-outline",
    tono: "info",
    gratis: false,
    insignia: "Para empezar",
    mensual: "$ 6.900",
    anual: "$ 59.900",
    equivalenteMensual: "$ 4.992",
    descripcion: "Para planear el mes, salir de deudas y ahorrar.",
    caracteristicas: [
      "Todo lo de Free, con cuentas ilimitadas",
      "Presupuesto, deudas y préstamos",
      "Metas y 1 natillera",
      "Reportes e importar extractos",
      "Aprende · niveles 1 al 8",
    ],
  },
];
