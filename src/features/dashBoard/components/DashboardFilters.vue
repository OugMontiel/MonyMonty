<script setup>
import {computed, onMounted} from "vue";

import {useDashboardFilters} from "@/stores/filterStore";
import {useMovimientoOptions} from "@/features/movimientos/logic/OptionsMovimiento";

// Store & Options
const filterStore = useDashboardFilters();
const {entidades, categorias, divisas, fetchOptions} = useMovimientoOptions();

onMounted(() => fetchOptions());

//Computed bidireccional para el DatePicker (range → [fechaInicio, fechaFin])
//  PrimeVue emite [Date, null] mientras el usuario elige el primer día,
//  y [Date, Date] cuando completa el rango. El setter maneja ambos casos.

const dateRange = computed({
  get: () => [filterStore.fechaInicio, filterStore.fechaFin],
  set: ([inicio, fin]) => {
    filterStore.setFechaInicio(inicio);
    if (fin) filterStore.setFechaFin(fin);
  },
});
</script>

<template>
  <div class="card p-4 mb-4 flex flex-col gap-4 border-none shadow-sm bg-white rounded-xl">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2>Filtros Globales</h2>
      <Button
        label="Limpiar Filtros"
        icon="pi pi-filter-slash"
        text
        severity="secondary"
        size="small"
        @click="filterStore.resetFilters()"
      />
    </div>

    <!-- Controles -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Rango de Fechas -->
      <div class="flex flex-col gap-2 w-full">
        <label>Rango de Fechas</label>
        <DatePicker
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          dateFormat="dd/mm/yy"
          showIcon
          placeholder="Seleccionar rango"
          class="w-full"
          input-class="w-full"
        />
      </div>

      <!-- Cuentas -->
      <div class="flex flex-col gap-2">
        <label>Cuentas</label>
        <MultiSelect
          :modelValue="filterStore.cuentas"
          :options="entidades"
          optionLabel="label"
          optionValue="value"
          placeholder="Todas las cuentas"
          display="chip"
          class="w-full"
          :maxSelectedLabels="2"
          @update:modelValue="filterStore.setCuentas($event)"
        />
      </div>

      <!-- Moneda -->
      <div class="flex flex-col gap-2">
        <label>Moneda</label>
        <MultiSelect
          :modelValue="filterStore.monedas"
          :options="divisas"
          optionLabel="label"
          optionValue="value"
          placeholder="Todas las monedas"
          display="chip"
          class="w-full"
          @update:modelValue="filterStore.setMonedas($event)"
        />
      </div>

      <!-- Categoría -->
      <div class="flex flex-col gap-2">
        <label>Categoría</label>
        <MultiSelect
          :modelValue="filterStore.categorias"
          :options="categorias"
          optionLabel="label"
          optionValue="value"
          filter
          placeholder="Todas las categorías"
          display="chip"
          class="w-full"
          :maxSelectedLabels="2"
          @update:modelValue="filterStore.setCategorias($event)"
        />
      </div>
    </div>
  </div>
</template>
