<template>
    hola desde car 
  <div class="card">
    <h2>{{ info.categoria.nombre }}</h2>
    <p><strong>Subcategoría:</strong> {{ info.subCategoria.nombre }}</p>
    <p><strong>Concepto:</strong> {{ info.concepto }}</p>
    <p><strong>Entidad:</strong> {{ info.entidad.nombre }}</p>
    <p><strong>Egreso:</strong> {{ info.egreso }}</p>
    <p><strong>Ingreso:</strong> {{ info.ingreso }}</p>
    <p><strong>Divisa:</strong> {{ info.divisa.codigo }}</p>
    <p><strong>Fecha:</strong> {{ info.fecha }}</p>
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
