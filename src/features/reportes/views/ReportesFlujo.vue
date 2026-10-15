<script setup>
/**
 * Reportes · Flujo de caja del mes: cuánto entró, cuánto salió, en qué categorías,
 * por cuenta y cuánto aguantarías sin ingresos (colchón).
 */
import {computed} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda, TIPOS_ENTIDAD, ENTIDAD_GENERICA} from "@/features/dashBoard/logic/formato.js";
import ReportesTabs from "../components/ReportesTabs.vue";
import CascadaFlujo from "../components/CascadaFlujo.vue";
import {delMes, esFlujo, totales, gastoPorCategoria, porCuenta, patrimonioAl, finDeMes, gastoPromedioMensual, ingresosEntreDias} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const {anio, mes, movimientos, cuentas, divisa, cargando, error, etiquetaMes, cargar} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const delPeriodo = computed(() => delMes(movimientos.value, anio.value, mes.value));
const t = computed(() => totales(delPeriodo.value));
const categorias = computed(() => gastoPorCategoria(delPeriodo.value));
const sinDatos = computed(() => !cargando.value && !error.value && delPeriodo.value.filter(esFlujo).length === 0);

// Categorías de ingreso más frecuentes ("salario y negocio")
const fuentes = computed(() => {
  const nombres = new Map();
  for (const m of delPeriodo.value) if (esFlujo(m) && m.tipo === "INGRESO") nombres.set(m.categoria?.categoria ?? "Otros", (nombres.get(m.categoria?.categoria ?? "Otros") ?? 0) + m.monto);
  return [...nombres.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([n]) => n.toLowerCase());
});

// Colchón: meses de gasto que cubre lo que tienes en tus cuentas al cierre del periodo
const colchon = computed(() => {
  const promedio = gastoPromedioMensual(movimientos.value, anio.value, mes.value);
  const saldo = patrimonioAl(movimientos.value, finDeMes(anio.value, mes.value));
  if (!promedio) return null;
  return Math.max(0, saldo / promedio);
});
const colchonTexto = computed(() => (colchon.value === null ? "—" : `${colchon.value.toLocaleString("es-CO", {maximumFractionDigits: 1})} ${Math.abs(colchon.value - 1) < 0.05 ? "mes" : "meses"}`));

const filasCuenta = computed(() => porCuenta(delPeriodo.value, cuentas.value));
const totalCuentas = computed(() => ({entro: filasCuenta.value.reduce((s, f) => s + f.entro, 0), salio: filasCuenta.value.reduce((s, f) => s + f.salio, 0)}));
const tipoDe = (c) => TIPOS_ENTIDAD[c.tipo] ?? ENTIDAD_GENERICA;

const lectura = computed(() => {
  if (t.value.ingresos === 0) return null;
  if (t.value.gastos > t.value.ingresos) {
    const top = categorias.value[0];
    return {tono: "warn", titulo: "Este mes salió más de lo que entró", texto: `Gastaste ${dinero(t.value.gastos - t.value.ingresos)} por encima de tus ingresos${top ? `; ${top.nombre} fue la categoría que más pesó` : ""}.`};
  }
  const juntos = ingresosEntreDias(delPeriodo.value, 1, 5);
  if (t.value.cantidadIngresos >= 2 && juntos !== null && juntos >= 60) {
    return {tono: "balance", titulo: "Los ingresos llegan juntos", texto: `El ${juntos} % entra entre el 1 y el 5. Programa tus pagos fijos para esos días y evita sobregiros a fin de mes.`};
  }
  return {tono: "balance", titulo: `Ahorraste el ${t.value.tasa} % de tus ingresos`, texto: `De ${dinero(t.value.ingresos)} que entraron, te quedaron ${dinero(t.value.ahorro)} después de gastar ${dinero(t.value.gastos)}.`};
});
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Reportes" titulo="Flujo de caja" :periodo="null" cta="" />

    <div class="mm-content" :aria-busy="cargando">
      <ReportesTabs activa="flujo" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando el reporte"><div class="mm-skel" style="width: 100%; height: 320px"></div></div>

      <div v-else-if="sinDatos" class="mm-card">
        <div class="mm-empty">
          <h3 class="t-h3">Sin movimientos en {{ etiquetaMes }}</h3>
          <p class="t-sm muted">Elige otro mes con las flechas o registra tus ingresos y gastos.</p>
        </div>
      </div>

      <template v-else-if="!error">
        <div class="grid g4">
          <div class="mm-card mm-kpi mm-rise" style="--i: 0">
            <div class="blob" style="background: var(--income)"></div>
            <div class="t-over">Entró</div>
            <div class="t-amt-lg income" style="margin-top: 10px">{{ dinero(t.ingresos) }}</div>
            <div class="t-xs muted" style="margin-top: 8px">{{ t.cantidadIngresos }} {{ t.cantidadIngresos === 1 ? "ingreso" : "ingresos" }}<template v-if="fuentes.length"> · {{ fuentes.join(" y ") }}</template></div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 1">
            <div class="blob" style="background: var(--expense)"></div>
            <div class="t-over">Salió</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(t.gastos) }}</div>
            <div class="t-xs muted" style="margin-top: 8px">{{ t.cantidadGastos }} {{ t.cantidadGastos === 1 ? "gasto" : "gastos" }} en {{ categorias.length }} {{ categorias.length === 1 ? "categoría" : "categorías" }}</div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 2">
            <div class="blob" style="background: var(--brand)"></div>
            <div class="t-over">Flujo neto</div>
            <div class="t-amt-lg" :style="{marginTop: '10px', color: t.ahorro < 0 ? 'var(--expense)' : 'var(--brand-ink)'}">{{ t.ahorro < 0 ? "−" : "+" }} {{ dinero(Math.abs(t.ahorro)) }}</div>
            <div v-if="t.tasa !== null" class="row" style="margin-top: 8px"><span class="mm-badge" :class="t.tasa >= 0 ? 'income' : 'expense'">{{ t.tasa }} % ahorrado</span></div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 3">
            <div class="blob" style="background: var(--balance)"></div>
            <div class="t-over">Colchón</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ colchonTexto }}</div>
            <div class="t-xs muted" style="margin-top: 8px">Lo que aguantas sin ingresos</div>
          </div>
        </div>

        <div class="mm-card mm-rise" style="--i: 4">
          <div class="mm-card-h">
            <div><h3 class="t-h3">Del ingreso a lo que te queda</h3><div class="t-xs muted">{{ etiquetaMes }} · cada barra resta un grupo de gastos</div></div>
            <div class="mm-legend">
              <span><i class="mm-dot" style="background: var(--income)"></i>Entra</span>
              <span><i class="mm-dot" style="background: var(--expense)"></i>Sale</span>
              <span><i class="mm-dot" style="background: var(--brand)"></i>Te queda</span>
            </div>
          </div>
          <CascadaFlujo :ingresos="t.ingresos" :categorias="categorias" :divisa="divisa" />
        </div>

        <div class="grid g-main">
          <div class="mm-card pad0 mm-rise" style="--i: 5">
            <div class="mm-card-h" style="padding: 20px 20px 0"><h3 class="t-h3">Por cuenta</h3><span class="t-xs muted">Las transferencias entre tus cuentas no cuentan como gasto</span></div>
            <div style="overflow-x: auto">
              <table class="mm-table" style="min-width: 560px">
                <thead><tr><th>Cuenta</th><th class="r">Entró</th><th class="r">Salió</th><th class="r">Neto</th></tr></thead>
                <tbody>
                  <tr v-for="f in filasCuenta" :key="f.cuenta.id">
                    <td>
                      <div class="row gap-2">
                        <div class="mm-ico sm cat" :style="{width: '28px', height: '28px', borderRadius: '8px', background: tipoDe(f.cuenta).color}"><MmIcon :i="tipoDe(f.cuenta).icono" :s="14" /></div>
                        <div><b>{{ f.cuenta.nombre }}</b><div v-if="f.transferido > 0" class="t-xs muted">Transferencias: {{ dinero(f.transferido) }}</div></div>
                      </div>
                    </td>
                    <td class="r t-amt" :class="f.entro ? 'income' : 'muted'">{{ f.entro ? `+ ${dinero(f.entro)}` : "$ 0" }}</td>
                    <td class="r t-amt" :class="{muted: !f.salio}">{{ f.salio ? `− ${dinero(f.salio)}` : "$ 0" }}</td>
                    <td class="r t-amt" :class="{expense: f.neto < 0}"><b>{{ f.neto < 0 ? "−" : "+" }} {{ dinero(Math.abs(f.neto)) }}</b></td>
                  </tr>
                  <tr style="background: var(--surface-2)">
                    <td><b>Total</b></td>
                    <td class="r t-amt income"><b>+ {{ dinero(totalCuentas.entro) }}</b></td>
                    <td class="r t-amt"><b>− {{ dinero(totalCuentas.salio) }}</b></td>
                    <td class="r t-amt"><b>{{ totalCuentas.entro - totalCuentas.salio < 0 ? "−" : "+" }} {{ dinero(Math.abs(totalCuentas.entro - totalCuentas.salio)) }}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="lectura" class="mm-card mm-rise" style="--i: 6">
            <div class="row gap-3">
              <div class="mm-ico" :class="lectura.tono"><MmIcon :i="lectura.tono === 'warn' ? 'warning' : 'bulb'" :s="22" /></div>
              <div class="grow"><div class="t-label">{{ lectura.titulo }}</div><div class="t-sm muted">{{ lectura.texto }}</div></div>
            </div>
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
