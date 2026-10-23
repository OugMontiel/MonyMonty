<script setup>
/** Reportes · Vista del plan Free: qué incluyen los reportes, sin dejar ver los datos. */
import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";

const BENEFICIOS = [
  {icono: "stats-chart", titulo: "Resumen del año", texto: "Ingresos contra gastos mes a mes y tu tasa de ahorro."},
  {icono: "swap-horizontal", titulo: "Flujo de caja", texto: "Del ingreso a lo que te queda, por cuenta y con tu colchón."},
  {icono: "pie-chart", titulo: "Gasto por categoría", texto: "En qué se va tu plata y cómo cambia frente a tu promedio."},
  {icono: "trending-up", titulo: "Patrimonio y comparación", texto: "Cómo crece lo que tienes y cómo vas frente a otros meses."},
];
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Resumen" titulo="Reportes" :periodo="null" cta="" />
    <div class="mm-content">
      <div class="mm-card mm-rise bloqueo">
        <div class="mm-ico lg brand mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="lock-closed" :s="26" /></div>
        <b class="mm-plan-tag" style="margin: 0">Basic</b>
        <h2 class="t-h2">Los reportes son parte del plan Basic</h2>
        <p class="t-sm muted" style="max-width: 420px">Mientras tanto sigues viendo tu estado actual y todos tus movimientos. Con Basic entiendes en qué se va tu plata mes a mes.</p>
      </div>

      <div class="grid g2">
        <div v-for="(b, i) in BENEFICIOS" :key="b.titulo" class="mm-card mm-rise" :style="{'--i': i + 1}">
          <div class="row gap-3">
            <div class="mm-ico brand"><MmIcon :i="b.icono" :s="22" /></div>
            <div class="grow"><div class="t-label">{{ b.titulo }}</div><div class="t-sm muted">{{ b.texto }}</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
.bloqueo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 40px 24px;
}
</style>
