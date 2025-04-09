<template>
  <div class="card">
    <h2>{{ info.fecha }}</h2>
    <p>
      <strong>Categoría:</strong>
      {{ Object.keys(info.categoria)[0] }} -
      {{ Object.values(info.categoria)[0] }}
    </p>
    <p>
      <strong>Concepto:</strong>
      {{ Object.keys(info.concepto)[0] }} -
      {{ Object.values(info.concepto)[0] }}
    </p>
    <p>
      <strong>Entidad:</strong>
      {{ Object.keys(info.entidad)[0] }} -
      {{ Object.values(info.entidad)[0] }}
    </p>
    <p>
      <strong>Ingreso/Egreso:</strong>
      {{ info.ingreso !== "$0,00" ? info.ingreso : info.egreso }}
    </p>
    <p>
      <strong>Divisa:</strong>
      {{ Object.keys(info.divisa)[0] || "Sin divisa" }} -
      {{ Object.values(info.divisa)[0] || "Sin nombre" }}
    </p>
  </div>
</template>

<script>
export default {
  name: "CarMov",
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log("Datos de la transacción:", this.info); // Verificar que los datos se reciban correctamente
  },
  methods: {
    getValor() {
      // Devuelve el ingreso o egreso basado en cuál tiene valor
      return this.info.ingreso !== "$0,00" ? this.info.ingreso : this.info.egreso;
    },
  },
};
</script>

<style>
/* Móvil Vertical (Regla General) */

/* Móvil Horizontal */
@media (min-width: 600px) and (max-width: 767px) {
  /* Estilos para móvil horizontal */
}

/* Tablet Vertical */
@media (min-width: 768px) and (max-width: 991px) {
  /* Estilos para tablet vertical */
}

/* Tablet Horizontal */
@media (min-width: 992px) and (max-width: 1199px) {
  /* Estilos para tablet horizontal y portátiles pequeños */
}

/* Portátil */
@media (min-width: 1200px) and (max-width: 1599px) {
  /* Estilos para portátiles */
}

/* PC de Escritorio */
@media (min-width: 1600px) {
  /* Estilos para PC de escritorio */
}

/* Reloj Inteligente */
@media (max-width: 299px) {
  /* Estilos para reloj inteligente */
}
</style>
