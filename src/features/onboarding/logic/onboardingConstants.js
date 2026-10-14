/**
 * Catálogos de la configuración inicial. Los valores que viajan a la API (tipo de
 * entidad, formato de icono "ion:…-outline", color "#hex") son los mismos que ya
 * usaban los modales de crear entidad y categoría.
 */

// Datos de presentación para las divisas conocidas; la lista real sale de GET divisa
export const DIVISAS_INFO = {
  COP: {nombre: "Peso colombiano", simbolo: "$", locale: "es-CO", tono: "", muestra: {saldo: 1250000, gasto: 24500, ingreso: 3500000}},
  USD: {nombre: "Dólar", simbolo: "US$", locale: "en-US", tono: "income", muestra: {saldo: 1250, gasto: 18, ingreso: 2400}},
  EUR: {nombre: "Euro", simbolo: "€", locale: "es-ES", tono: "balance", muestra: {saldo: 1250, gasto: 18, ingreso: 2400}},
  MXN: {nombre: "Peso mexicano", simbolo: "MX$", locale: "es-MX", tono: "warning", muestra: {saldo: 1250, gasto: 18, ingreso: 2400}},
};

// Se usan si la API no devuelve divisas todavía
export const DIVISAS_POR_DEFECTO = Object.keys(DIVISAS_INFO).map((codigo) => ({value: codigo, label: DIVISAS_INFO[codigo].nombre}));

export const TIPOS_CUENTA = [
  {value: "BANCO", label: "Banco", icono: "business", color: "var(--cat-sky)"},
  {value: "EFECTIVO", label: "Efectivo", icono: "cash", color: "var(--cat-green)"},
  {value: "COOPERATIVA", label: "Cooperativa", icono: "people", color: "var(--cat-plum)"},
];

// Categorías sugeridas: `icono` es el nombre del diseño; a la API se envía como "ion:<icono>-outline"
export const CATEGORIAS_SUGERIDAS = [
  {clave: "mercado", nombre: "Mercado", icono: "cart", color: "#0f8f8a"},
  {clave: "hogar", nombre: "Hogar", icono: "home", color: "#5458d6"},
  {clave: "comida", nombre: "Comida", icono: "fast-food", color: "#e4572e"},
  {clave: "transporte", nombre: "Transporte", icono: "bus", color: "#c27c00"},
  {clave: "salud", nombre: "Salud", icono: "medkit", color: "#c93f72"},
  {clave: "educacion", nombre: "Educación", icono: "school", color: "#8b4fb3"},
  {clave: "entretenimiento", nombre: "Entretenimiento", icono: "tv", color: "#2878c7"},
  {clave: "trabajo", nombre: "Trabajo", icono: "briefcase", color: "#3d8a3a"},
  {clave: "ocio", nombre: "Ocio", icono: "game-controller", color: "#5f6b7a"},
  {clave: "regalos", nombre: "Regalos", icono: "gift", color: "#c93f72"},
  {clave: "viajes", nombre: "Viajes", icono: "airplane", color: "#2878c7"},
  {clave: "servicios", nombre: "Servicios", icono: "receipt", color: "#5f6b7a"},
];

// Las primeras llegan marcadas: son las más comunes
export const CATEGORIAS_PRESELECCIONADAS = ["mercado", "hogar", "comida", "transporte", "salud", "servicios"];

export const COLOR_CATEGORIA_PROPIA = "#5f6b7a";
export const ICONO_CATEGORIA_PROPIA = "pricetags";
