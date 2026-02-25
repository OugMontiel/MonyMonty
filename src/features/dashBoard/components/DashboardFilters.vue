<script setup>
import {computed, onMounted, watch} from "vue";

import {useDashboardFilters} from "@/stores/contexto/filterStore";
import {useMovimientoOptions} from "@/features/movimientos/logic/OptionsMovimiento";

// Store & Options
const filterStore = useDashboardFilters();
const {entidades, categorias, divisas, fetchOptions} = useMovimientoOptions();

onMounted(() => fetchOptions());

const dateRange = computed({
  get: () => [filterStore.fechaInicio, filterStore.fechaFin],
  set: (val) => { 
    if (val && val[0]) filterStore.setFechaInicio(val[0]);
    if (val && val[1]) filterStore.setFechaFin(val[1]);
  },
});
</script>

<template>
  <div class="card p-4 mb-4 flex flex-col gap-4 border-none shadow-sm bg-white rounded-xl">
    <!-- Controles -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Rango de Fechas -->
      <div class="flex flex-col gap-2 w-full">
        <label for="RangoFechasFiltro">Rango de Fechas</label>
        <DatePicker
          id="RangoFechasFiltro"
          v-model="dateRange"
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
        <label for="CuentasFiltro">Cuentas</label>
        <MultiSelect
          id="CuentasFiltro"
          :modelValue="filterStore.cuentas"
          :options="entidades"
          optionLabel="label"
          optionValue="value"
          placeholder="Todas las cuentas"
          display="chip"
          class="w-full"
          @update:modelValue="filterStore.setCuentas($event)"
        />
      </div>

      <!-- Moneda -->
      <div class="flex flex-col gap-2">
        <label for="MonedasFiltro">Moneda</label>
        <MultiSelect
          id="MonedasFiltro"
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
        <label for="CategoriasFiltro">Categoría</label>
        <MultiSelect
          id="CategoriasFiltro"
          :modelValue="filterStore.categorias"
          :options="categorias"
          optionLabel="label"
          optionValue="value"
          filter
          placeholder="Todas las categorías"
          display="chip"
          class="w-full"
          @update:modelValue="filterStore.setCategorias($event)"
        />
      </div>

      <!-- Header -->
    <div class="flex justify-between items-center">
      <Button
        label="Limpiar Filtros"
        icon="pi pi-filter-slash"
        text
        severity="secondary"
        size="small"
        @click="filterStore.resetAllFilters()"
      />
      <Button
        label="Aplicar Filtros"
        icon="pi pi-filter"
        text
        severity="secondary"
        size="small"
        @click="filterStore.applyFilters()"
      />
    </div>
    </div>
  </div>
</template>
