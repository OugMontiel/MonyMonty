/**
 * API simulada en memoria para el modo demo. Responde con las mismas formas que MonyMontyApi
 * (auth, user, entidad, categoria, divisa y movimiento) interceptando axios, de modo que el
 * resto del código no cambia. Los datos viven solo mientras la pestaña esté abierta.
 */
import axios from "axios";

const ahora = new Date();
const hace = (dias, hora = 10, min = 15) => new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - dias, hora, min).toISOString();

// ---------- Datos de ejemplo ----------
const usuario = {nombre: "Laura", apellido: "Gómez", email: "laura@correo.co", planId: "basic"};

const categorias = [
  {_id: "c1", categoria: "Mercado", icono: "ion:cart-outline", color: "#0f8f8a", subcategorias: [{_id: "s1", subcategoria: "Víveres"}, {_id: "s1b", subcategoria: "Aseo"}]},
  {_id: "c2", categoria: "Hogar", icono: "ion:home-outline", color: "#5458d6", subcategorias: [{_id: "s2", subcategoria: "Arriendo"}, {_id: "s2b", subcategoria: "Servicios"}]},
  {_id: "c3", categoria: "Comida", icono: "ion:fast-food-outline", color: "#e4572e", subcategorias: [{_id: "s3", subcategoria: "Almuerzo"}, {_id: "s3b", subcategoria: "Restaurantes"}]},
  {_id: "c4", categoria: "Transporte", icono: "ion:bus-outline", color: "#c27c00", subcategorias: [{_id: "s4", subcategoria: "Bus"}, {_id: "s4b", subcategoria: "Gasolina"}]},
  {_id: "c5", categoria: "Negocio", icono: "ion:storefront-outline", color: "#3d8a3a", subcategorias: [{_id: "s5", subcategoria: "Clientes"}]},
  {_id: "c6", categoria: "Suscripciones", icono: "ion:tv-outline", color: "#2878c7", subcategorias: [{_id: "s6", subcategoria: "Streaming"}]},
  {_id: "c7", categoria: "Salud", icono: "ion:medkit-outline", color: "#c93f72", subcategorias: [{_id: "s7", subcategoria: "Citas"}]},
];

const entidades = [
  {_id: "e1", nombre: "Bancolombia Ahorros", tipo: "BANCO", numero: "6789"},
  {_id: "e2", nombre: "Nequi", tipo: "BANCO", numero: "0412"},
  {_id: "e3", nombre: "Efectivo", tipo: "EFECTIVO", numero: ""},
  {_id: "e4", nombre: "Cooperativa", tipo: "COOPERATIVA", numero: "1150"},
];

const movimientos = [];
let consecutivo = 0;

/** Rellena los campos que la API devuelve ya resueltos (categoria, subcategoria, entidad y detalle de transferencia) */
function poblar(m) {
  const cat = categorias.find((c) => c._id === m.categoriaId);
  const sub = cat?.subcategorias.find((s) => s._id === m.subcategoriaId);
  const ent = entidades.find((e) => e._id === m.entidadId);
  const nombre = (id) => entidades.find((e) => e._id === id)?.nombre;
  m.categoria = cat && {_id: cat._id, categoria: cat.categoria, icono: cat.icono, color: cat.color};
  m.subcategoria = sub && {_id: sub._id, subcategoria: sub.subcategoria};
  m.entidad = ent && m.tipo !== "TRANSFERENCIA" ? {_id: ent._id, nombre: ent.nombre, tipo: ent.tipo, numero: ent.numero} : undefined;
  if (m.tipo === "TRANSFERENCIA" && m.transferencia) {
    m.transferenciaDetalle = {
      origen: {_id: m.transferencia.origenEntidadId, nombre: nombre(m.transferencia.origenEntidadId)},
      destino: {_id: m.transferencia.destinoEntidadId, nombre: nombre(m.transferencia.destinoEntidadId)},
    };
  } else {
    delete m.transferenciaDetalle;
  }
  return m;
}

function agregar(tipo, monto, catId, entId, dias, titulo, extra = {}) {
  const cat = categorias.find((c) => c._id === catId);
  const id = ++consecutivo;
  const fecha = extra.fecha ?? hace(dias, 7 + (id % 12), (id * 7) % 60);
  const mov = poblar({
    _id: `m${id}`,
    referencia: `TXN-${ahora.getFullYear()}${ahora.getMonth() + 1}-${String(id).padStart(4, "0")}`,
    tipo,
    monto,
    divisaId: "COP",
    estado: "COMPLETADO",
    origen: "MANUAL",
    fecha,
    createdAt: fecha,
    categoriaId: catId,
    subcategoriaId: extra.subcategoriaId ?? cat?.subcategorias[0]._id,
    entidadId: tipo === "TRANSFERENCIA" ? undefined : entId,
    concepto: titulo ? {titulo, detalle: extra.detalle ?? ""} : undefined,
    tags: [],
    esRecurrente: false,
    auditoria: {creadoPor: {nombre: usuario.nombre}},
    ...extra,
  });
  movimientos.push(mov);
  return mov;
}

// Saldos iniciales (la API los guarda como ingresos "de sistema")
agregar("INGRESO", 2_800_000, "c5", "e1", 70, "", {esSistema: true});
agregar("INGRESO", 1_800_000, "c5", "e2", 70, "", {esSistema: true});
agregar("INGRESO", 600_000, "c5", "e3", 70, "", {esSistema: true});
agregar("INGRESO", 1_540_000, "c5", "e4", 70, "", {esSistema: true});
// Meses anteriores, para que la gráfica de flujo tenga forma
[
  [62, 3_900_000, 3_500_000],
  [92, 4_400_000, 4_050_000],
  [122, 4_100_000, 3_800_000],
  [152, 4_700_000, 4_300_000],
].forEach(([d, ing, gas]) => {
  agregar("INGRESO", ing, "c5", "e1", d, "Ingresos del mes");
  agregar("EGRESO", gas, "c2", "e1", d - 2, "Gastos del mes");
});
agregar("INGRESO", 5_000_000, "c5", "e1", 33, "Ingresos del mes pasado");
agregar("EGRESO", 3_850_000, "c2", "e1", 31, "Gastos del mes pasado");

// Mes actual
agregar("INGRESO", 5_000_000, "c5", "e1", 8, "Pago clientes");
agregar("EGRESO", 742_000, "c1", "e1", 6, "Mercado quincena", {detalle: "Compra grande de la quincena en el supermercado."});
agregar("EGRESO", 520_000, "c2", "e1", 5, "Arriendo parcial", {subcategoriaId: "s2"});
agregar("EGRESO", 388_000, "c3", "e2", 4, "Restaurantes", {subcategoriaId: "s3b"});
agregar("EGRESO", 260_000, "c4", "e3", 3, "Transporte semanal");
agregar("EGRESO", 165_000, "c6", "e2", 2, "Streaming y apps", {esRecurrente: true});
agregar("EGRESO", 186_400, "c1", "e1", 1, "Mercado de la semana");
agregar("EGRESO", 12_000, "c4", "e3", 1, "Pasajes MIO");
agregar("TRANSFERENCIA", 200_000, "c1", "e1", 0, "Recarga Nequi", {transferencia: {origenEntidadId: "e1", destinoEntidadId: "e2"}});
agregar("INGRESO", 1_200_000, "c5", "e1", 0, "Pago cliente — diseño web");
agregar("EGRESO", 24_500, "c3", "e2", 0, "Almuerzo ejecutivo", {detalle: "Almuerzo con el equipo antes de la reunión con el cliente."});

// Gastos pequeños de los últimos días, para que la lista tenga varias páginas
const menudos = [
  ["Tinto y pan", "c3", "e3", 7_500], ["Taxi al centro", "c4", "e2", 18_000], ["Farmacia", "c7", "e2", 32_000], ["Domicilio cena", "c3", "e2", 41_000],
  ["Parqueadero", "c4", "e3", 9_000], ["Frutas plaza", "c1", "e3", 38_000], ["Cita odontológica", "c7", "e1", 90_000], ["Aseo hogar", "c1", "e1", 54_000],
  ["Gasolina moto", "c4", "e1", 28_000], ["Pizza viernes", "c3", "e2", 46_000], ["Internet", "c2", "e1", 85_000], ["Energía", "c2", "e1", 132_000],
];
for (let i = 0; i < 36; i++) {
  const [t, c, e, v] = menudos[i % menudos.length];
  agregar("EGRESO", v + (i % 5) * 1_000, c, e, 2 + Math.floor(i * 1.1), t);
}

// ---------- Utilidades ----------
const enRango = (m, b) => (!b.fechaInicio || new Date(m.fecha) >= new Date(b.fechaInicio)) && (!b.fechaFin || new Date(m.fecha) <= new Date(b.fechaFin));
const porFechaDesc = (a, b) => new Date(b.fecha) - new Date(a.fecha);
const etiquetaEntidad = (e) => (e.numero ? `${e.tipo} - ${e.nombre} - ${e.numero}` : e.nombre);

/** Mismos filtros que MonyMontyApi (construirFiltros): tipo, fechas, cuentas, monedas y categorías */
function pasaFiltros(m, b) {
  if (b.tipo && (b.tipo === "STANDARD" ? m.tipo === "TRANSFERENCIA" : m.tipo !== b.tipo)) return false;
  if (!enRango(m, b)) return false;
  if (b.cuentas?.length && ![m.entidadId, m.transferencia?.origenEntidadId, m.transferencia?.destinoEntidadId].some((id) => b.cuentas.includes(id))) return false;
  if (b.monedas?.length && !b.monedas.includes(m.divisaId)) return false;
  if (b.categorias?.length && !b.categorias.includes(m.categoriaId)) return false;
  return true;
}

// ---------- Rutas (método + ruta sin barra final) ----------
const rutas = {
  "GET auth/check": () => ({authenticated: true}),
  "POST auth/login": () => ({success: true}),
  "GET auth/logout": () => ({success: true}),
  "POST auth/recuperar": () => ({message: "Correo enviado (demo)"}),
  "GET auth/checkToken": () => ({data: {userDelTocken: {nombre: usuario.nombre, email: usuario.email}}, message: "Token válido"}),
  "POST auth/updatePassword": () => ({message: "Contraseña actualizada (demo)"}),
  "POST user": () => ({message: "Usuario creado (demo)"}),
  "GET user/me": () => usuario,

  "GET divisa": () => ({data: [{value: "COP", label: "FIAT - COP - Peso colombiano"}, {value: "USD", label: "FIAT - USD - Dólar estadounidense"}, {value: "EUR", label: "FIAT - EUR - Euro"}, {value: "MXN", label: "FIAT - MXN - Peso mexicano"}]}),
  "GET categoria": () => ({
    data: categorias.map((c) => ({_id: c._id, value: c._id, label: c.categoria, isPrivate: false, subcategorias: c.subcategorias.map((s) => ({value: s._id, label: s.subcategoria}))})),
  }),
  "POST categoria": (b) => {
    categorias.push({_id: `c${categorias.length + 1}`, categoria: b.nombreCategoria, icono: b.icono, color: b.color, subcategorias: [{_id: `s${categorias.length + 1}`, subcategoria: "General"}]});
    return {success: true};
  },
  "GET entidad": () => ({data: entidades.map((e) => ({_id: e._id, value: e._id, label: etiquetaEntidad(e)}))}),
  "POST entidad": (b) => {
    const e = {_id: `e${entidades.length + 1}`, nombre: b.nombre, tipo: b.tipo, numero: b.numero || "", divisaId: b.divisaId};
    entidades.push(e);
    if (b.saldoInicial > 0) agregar("INGRESO", b.saldoInicial, "c5", e._id, 0, "", {esSistema: true});
    return {data: e};
  },

  "POST movimiento/dashboard": (b) => {
    const f = movimientos.filter((m) => enRango(m, b));
    const i = f.filter((m) => m.tipo === "INGRESO").reduce((s, m) => s + m.monto, 0);
    const g = f.filter((m) => m.tipo === "EGRESO").reduce((s, m) => s + m.monto, 0);
    return {data: {totalIngresado: i, totalEgresado: g, totalDisponible: i - g}};
  },
  "POST movimiento/ranking": (b) => {
    const f = movimientos.filter((m) => m.tipo === "EGRESO" && enRango(m, b));
    const total = f.reduce((s, m) => s + m.monto, 0) || 1;
    const por = new Map();
    f.forEach((m) => por.set(m.categoriaId, (por.get(m.categoriaId) ?? 0) + m.monto));
    const filas = [...por.entries()].sort((a, b2) => b2[1] - a[1]).map(([id, monto]) => {
      const c = categorias.find((x) => x._id === id);
      return {_id: id, categoriaId: id, labelCategoria: c.categoria, montoCategoria: monto, porcentajeCategoria: Math.round((monto / total) * 100), iconoCategoria: c.icono, colorCategoria: c.color, subcategorias: []};
    });
    return {data: filas};
  },
  "POST movimiento/list": (b) => {
    const f = movimientos.filter((m) => pasaFiltros(m, b)).sort(porFechaDesc);
    return {data: {data: f.slice((b.page - 1) * b.limit, b.page * b.limit), total: f.length, page: b.page, totalPages: Math.ceil(f.length / b.limit), limit: b.limit}};
  },
  "POST movimiento": (b) => {
    const m = agregar(b.tipo, b.monto, b.categoriaId, b.entidadId, 0, b.concepto?.titulo ?? "", {
      fecha: b.fecha,
      createdAt: new Date().toISOString(),
      divisaId: b.divisaId,
      concepto: b.concepto,
      transferencia: b.transferencia,
      tags: b.tags ?? [],
      esRecurrente: Boolean(b.esRecurrente),
      subcategoriaId: b.subcategoriaId,
      origen: b.origen,
    });
    // La API devuelve el resultado de insertOne
    return {success: true, data: {acknowledged: true, insertedId: m._id}};
  },
};

/** "GET movimiento/m12" -> movimiento por id (ver, editar y eliminar) */
function rutaConId(metodo, ruta, cuerpo) {
  const m = /^movimiento\/(m\d+)$/.exec(ruta);
  if (!m) return undefined;
  const i = movimientos.findIndex((x) => x._id === m[1]);
  if (i < 0) return {status: 404, data: {message: "Movimiento no encontrado"}};
  if (metodo === "GET") {
    // buscarPorId de la API no resuelve el detalle de la transferencia
    const {transferenciaDetalle, ...resto} = movimientos[i];
    return {status: 200, data: {data: resto}};
  }
  if (metodo === "DELETE") {
    movimientos.splice(i, 1);
    return {status: 204, data: ""};
  }
  if (metodo === "PUT") {
    const previo = movimientos[i];
    movimientos[i] = poblar({...previo, ...cuerpo, _id: previo._id, updatedAt: new Date().toISOString(), concepto: cuerpo.concepto});
    return {status: 200, data: {success: true}};
  }
  return undefined;
}

/** Instala el adaptador: ninguna petición sale a la red */
export function instalarDemo() {
  axios.defaults.adapter = async (config) => {
    // La URL puede venir con o sin VITE_API_URL; se toma desde el primer recurso conocido
    const ruta = (config.url ?? "").split("?")[0].replace(/^.*?(auth|user|divisa|categoria|entidad|movimiento)(?=\/|$)/, "$1").replace(/\/$/, "");
    const metodo = (config.method ?? "get").toUpperCase();
    const cuerpo = typeof config.data === "string" ? JSON.parse(config.data || "{}") : (config.data ?? {});

    const conId = rutaConId(metodo, ruta, cuerpo);
    const manejador = rutas[`${metodo} ${ruta}`];
    const respuesta = conId ?? (manejador ? {status: metodo === "POST" && /^(user|entidad|categoria|movimiento|auth\/login)$/.test(ruta) ? 201 : 200, data: manejador(cuerpo)} : {status: 404, data: {message: `Demo: sin ruta para ${metodo} ${ruta}`}});

    // Pequeña espera para que se vean los estados de carga
    await new Promise((r) => setTimeout(r, 250));
    const resultado = {data: respuesta.data, status: respuesta.status, statusText: String(respuesta.status), headers: {}, config, request: {}};
    if (respuesta.status >= 400) {
      const error = new Error(`Request failed with status code ${respuesta.status}`);
      error.config = config;
      error.response = resultado;
      throw error;
    }
    return resultado;
  };
  console.info("%cMonyMonty · modo demo: las peticiones a la API están simuladas", "color:#f25c2f;font-weight:bold");
}
