<!--  a qui se va a esplicar todo lo que es mony monty ... del por que y para que  -->
<template>
  <div class="mony-monty-description">
    <h3 class="title">¿Qué es MonyMonty?</h3>
    <p class="description">
      Es una plataforma financiera, un gestor de finanzas con todas las herramientas y facilidades para que puedas tener un control total de
      tus finanzas.
    </p>
  </div>
</template>

<script>
export default {
  name: "QueEsMonyMonty",
};
</script>

<style scoped>
.mony-monty-description {
  background-color: #f9f9f9; /* Fondo claro */
  border: 1px solid #e0e0e0; /* Borde sutil */
  border-radius: 8px; /* Bordes redondeados */
  padding: 20px; /* Espaciado interno */
  margin: 20px 0; /* Margen superior e inferior */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

.title {
  font-size: 1.5em; /* Tamaño de fuente más grande para el título */
  color: #333; /* Color del texto del título */
  margin-bottom: 10px; /* Espacio debajo del título */
}

.description {
  font-size: 1em; /* Tamaño de fuente normal para la descripción */
  color: #555; /* Color del texto de la descripción */
  line-height: 1.6; /* Espaciado entre líneas */
}
</style>
