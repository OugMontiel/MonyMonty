import {ref, computed, watch} from "vue";

import {useGlobalState} from "@/composables/useGlobalState";
import {capitalizar, nombreMes} from "@/features/dashBoard/logic/formato.js";
import {movimientos, movimientosSinCargar, entidades, cargarTodosLosMovimientos, cargarEntidades} from "@/features/movimientos/logic/movimientosStore.js";
import {parseLabelEntidad} from "@/features/dashBoard/logic/formato.js";

/**
 * Estado compartido de los reportes: el año y el mes que se están mirando (lo comparten las pestañas),
 * los datos de la API y los atajos para navegar entre periodos. Es un singleton.
 */
const hoy = new Date();
const anio = ref(hoy.getFullYear());
const mes = ref(hoy.getMonth()); // 0-11
const cargando = ref(movimientosSinCargar.value);
const error = ref("");
const exportarAbierto = ref(false);
const mesDetalle = ref(null); // {anio, mes} cuando el panel de detalle del mes está abierto

export const PESTANAS = [
  {id: "resumen", etiqueta: "Resumen", icono: "grid", ruta: "/reportes", modo: "anio"},
  {id: "flujo", etiqueta: "Flujo de caja", icono: "swap-horizontal", ruta: "/reportes/flujo", modo: "mes"},
  {id: "categorias", etiqueta: "Categorías", icono: "pie-chart", ruta: "/reportes/categorias", modo: "mes"},
  {id: "patrimonio", etiqueta: "Patrimonio", icono: "trending-up", ruta: "/reportes/patrimonio", modo: "anio"},
  {id: "comparar", etiqueta: "Comparar", icono: "analytics", ruta: "/reportes/comparar", modo: "mes"},
  {id: "cierre", etiqueta: "Cierre del mes", icono: "trophy", ruta: "/reportes/cierre", modo: "mes"},
];

export async function cargarDatosReportes() {
  error.value = "";
  try {
    await Promise.all([cargarTodosLosMovimientos(), cargarEntidades()]);
  } catch (err) {
    error.value = err.response?.data?.message || "No pudimos cargar tus movimientos. Revisa tu conexión e inténtalo de nuevo.";
  } finally {
    cargando.value = false;
  }
}

export function useReportes() {
  const {globalDataRefreshTrigger} = useGlobalState();
  // Los datos se recargan cuando se crea, edita o elimina un movimiento
  watch(globalDataRefreshTrigger, cargarDatosReportes);

  const esMesActual = computed(() => anio.value === hoy.getFullYear() && mes.value === hoy.getMonth());
  const esAnioActual = computed(() => anio.value === hoy.getFullYear());
  const nombreDelMes = computed(() => capitalizar(nombreMes(new Date(anio.value, mes.value, 1))));
  const etiquetaMes = computed(() => `${nombreDelMes.value} ${anio.value}`);

  function moverMes(delta) {
    const f = new Date(anio.value, mes.value + delta, 1);
    // No se navega al futuro
    if (f > new Date(hoy.getFullYear(), hoy.getMonth(), 1)) return;
    anio.value = f.getFullYear();
    mes.value = f.getMonth();
  }

  function moverAnio(delta) {
    const a = anio.value + delta;
    if (a > hoy.getFullYear()) return;
    anio.value = a;
    // Al cambiar de año el mes no puede quedar en el futuro
    if (a === hoy.getFullYear() && mes.value > hoy.getMonth()) mes.value = hoy.getMonth();
  }

  /** Cuentas con nombre legible (GET entidad solo trae una etiqueta) */
  const cuentas = computed(() =>
    entidades.value.map((e) => {
      const d = movimientos.value.find((m) => m.entidad?._id === e._id)?.entidad ?? parseLabelEntidad(e.label);
      return {id: e._id ?? e.value, nombre: d.nombre, tipo: d.tipo, numero: d.numero};
    })
  );

  const divisa = computed(() => movimientos.value.find((m) => m.divisaId)?.divisaId ?? "COP");

  return {
    anio,
    mes,
    movimientos,
    cuentas,
    divisa,
    cargando,
    error,
    exportarAbierto,
    mesDetalle,
    esMesActual,
    esAnioActual,
    nombreDelMes,
    etiquetaMes,
    hoy,
    moverMes,
    moverAnio,
    cargar: cargarDatosReportes,
  };
}
