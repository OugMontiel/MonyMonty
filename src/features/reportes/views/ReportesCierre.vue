<script setup>
/**
 * Reportes · Cierre del mes: un repaso para cerrar el mes: cómo terminó, lo más destacado
 * y qué conviene revisar (movimientos sin categoría).
 */
import {computed} from "vue";
import {useRouter} from "vue-router";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda} from "@/features/dashBoard/logic/formato.js";
import {filtros, limpiarFiltros, aInputFecha} from "@/features/movimientos/logic/filtrosMovimientos.js";
import ReportesTabs from "../components/ReportesTabs.vue";
import {delMes, esFlujo, totales, gastoPorCategoria, cambioPct, inicioDeMes, finDeMes} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const router = useRouter();
const {anio, mes, movimientos, divisa, cargando, error, etiquetaMes, esMesActual, hoy, cargar} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const delPeriodo = computed(() => delMes(movimientos.value, anio.value, mes.value));
const anterior = computed(() => {
  const f = new Date(anio.value, mes.value - 1, 1);
  return delMes(movimientos.value, f.getFullYear(), f.getMonth());
});
const t = computed(() => totales(delPeriodo.value));
const tPrevio = computed(() => totales(anterior.value));
const categorias = computed(() => gastoPorCategoria(delPeriodo.value));
const sinDatos = computed(() => !cargando.value && !error.value && delPeriodo.value.filter(esFlujo).length === 0);

const gastos = computed(() => delPeriodo.value.filter((m) => esFlujo(m) && m.tipo === "EGRESO"));
const mayorGasto = computed(() => [...gastos.value].sort((a, b) => b.monto - a.monto)[0] ?? null);
const diaMasCaro = computed(() => {
  const dias = new Map();
  for (const m of gastos.value) {
    const d = new Date(m.fecha).getDate();
    dias.set(d, (dias.get(d) ?? 0) + m.monto);
  }
  const mejor = [...dias.entries()].sort((a, b) => b[1] - a[1])[0];
  return mejor ? {dia: mejor[0], monto: mejor[1]} : null;
});
const sinCategoria = computed(() => delPeriodo.value.filter((m) => esFlujo(m) && !m.categoriaId));

// Mientras el mes sigue en curso el cierre es parcial
const enCurso = computed(() => esMesActual.value);
const diasRestantes = computed(() => finDeMes(anio.value, mes.value).getDate() - hoy.getDate());

const cambioAhorro = computed(() => cambioPct(t.value.ahorro, tPrevio.value.ahorro));

function revisarSinCategoria() {
  limpiarFiltros();
  filtros.preset = "personalizado";
  filtros.desde = aInputFecha(inicioDeMes(anio.value, mes.value));
  filtros.hasta = aInputFecha(finDeMes(anio.value, mes.value));
  router.push("/movimientos");
}
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Reportes" titulo="Cierre del mes" :periodo="null" cta="" />

    <div class="mm-content" :aria-busy="cargando">
      <ReportesTabs activa="cierre" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando el reporte"><div class="mm-skel" style="width: 100%; height: 320px"></div></div>

      <div v-else-if="sinDatos" class="mm-card">
        <div class="mm-empty">
          <h3 class="t-h3">Sin movimientos en {{ etiquetaMes }}</h3>
          <p class="t-sm muted">Elige otro mes con las flechas para ver su cierre.</p>
        </div>
      </div>

      <template v-else-if="!error">
        <div class="mm-card mm-rise">
          <div class="row gap-3" style="flex-wrap: wrap">
            <div class="mm-ico lg" :class="t.ahorro >= 0 ? 'income' : 'warn'"><MmIcon :i="t.ahorro >= 0 ? 'trophy' : 'warning'" :s="24" /></div>
            <div class="grow">
              <div class="t-over">{{ enCurso ? `${etiquetaMes} · faltan ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}` : etiquetaMes }}</div>
              <h2 class="t-h2">{{ t.ahorro >= 0 ? `${enCurso ? "Vas con" : "Cerraste con"} ${dinero(t.ahorro)} a favor` : `${enCurso ? "Vas con" : "Cerraste con"} ${dinero(Math.abs(t.ahorro))} de déficit` }}</h2>
              <p class="t-sm muted" style="margin-top: 4px">
                Entraron {{ dinero(t.ingresos) }} y salieron {{ dinero(t.gastos) }}<template v-if="t.tasa !== null"> · ahorraste el {{ t.tasa }} %</template>.
                <template v-if="cambioAhorro !== null && tPrevio.ahorro !== 0">Frente al mes anterior tu ahorro {{ t.ahorro >= tPrevio.ahorro ? "mejoró" : "bajó" }}.</template>
              </p>
            </div>
          </div>
        </div>

        <div class="grid g3">
          <div class="mm-card mm-rise" style="--i: 1">
            <div class="t-over">Categoría que más pesó</div>
            <div class="t-h3" style="margin-top: 8px">{{ categorias[0]?.nombre ?? "—" }}</div>
            <div v-if="categorias[0]" class="t-sm muted num">{{ dinero(categorias[0].monto) }} · {{ Math.round(categorias[0].pct) }} % de tus gastos</div>
          </div>
          <div class="mm-card mm-rise" style="--i: 2">
            <div class="t-over">Mayor gasto</div>
            <div class="t-h3 ellipsis" style="margin-top: 8px">{{ mayorGasto?.concepto?.titulo ?? mayorGasto?.categoria?.categoria ?? "—" }}</div>
            <div v-if="mayorGasto" class="t-sm muted num">{{ dinero(mayorGasto.monto) }}</div>
          </div>
          <div class="mm-card mm-rise" style="--i: 3">
            <div class="t-over">Día más caro</div>
            <div class="t-h3" style="margin-top: 8px">{{ diaMasCaro ? `${diaMasCaro.dia} de ${etiquetaMes.split(" ")[0].toLowerCase()}` : "—" }}</div>
            <div v-if="diaMasCaro" class="t-sm muted num">{{ dinero(diaMasCaro.monto) }}</div>
          </div>
        </div>

        <div class="mm-card mm-rise" style="--i: 4">
          <div class="mm-card-h"><h3 class="t-h3">Antes de cerrar</h3></div>
          <div class="row gap-3">
            <div class="mm-ico" :class="sinCategoria.length ? 'warn' : 'income'"><MmIcon :i="sinCategoria.length ? 'warning' : 'checkmark-circle'" :s="22" /></div>
            <div class="grow">
              <div class="t-label">{{ sinCategoria.length ? `${sinCategoria.length} ${sinCategoria.length === 1 ? "movimiento sin categoría" : "movimientos sin categoría"}` : "Todos tus movimientos tienen categoría" }}</div>
              <div class="t-sm muted">{{ sinCategoria.length ? "Categorízalos para que tus reportes reflejen en qué se fue tu plata." : "Tus reportes de este mes están completos." }}</div>
            </div>
            <button v-if="sinCategoria.length" type="button" class="mm-btn sm" @click="revisarSinCategoria">Revisar</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
</style>
