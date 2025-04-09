<!-- ene sta vamos a estar actualizado como va la paguina y como van los cambios y apra que es cada archivo  -->
<template>
  <div class="frontend-structure">
    <h3 class="title">¿En Frontend la cosa es así?</h3>
    <p class="intro">Ya que tenemos los dos lados en un mismo repositorio, tenemos lo siguiente:</p>
    <pre class="structure">
      ├── App.vue
      ├── assets
      │   ├── img
      │   │   ├── MonyMontySinFondo2.png
      │   │   ├── MonyMontySinFondo3.png
      │   │   └── MonyMontySinFondo.png
      │   └── style.css
      ├── components
      │   ├── carMov.vue
      │   └── content
      │       ├── carpetaBackend.vue
      │       ├── carpetaFrontend.vue
      │       ├── DefinicionDeCarpetas.vue
      │       ├── Instalacion.vue
      │       └── QueEsMonyMonty.vue
      ├── main.js
      ├── router
      │   └── index.js
      └── views
          ├── dashboard.vue
          ├── document.vue
          ├── home.vue
          └── NewMov.vue
    </pre>
  </div>
</template>

<script>
export default {
  name: "EstructuraFrontend",
};
</script>

<style scoped>
.frontend-structure {
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

.intro {
  font-size: 1em; /* Tamaño de fuente normal para la introducción */
  color: #555; /* Color del texto de la introducción */
  line-height: 1.6; /* Espaciado entre líneas */
  margin-bottom: 10px; /* Espacio debajo de la introducción */
}

.structure {
  background-color: #f1f1f1; /* Fondo claro para la estructura */
  border: 1px solid #ccc; /* Borde sutil */
  border-radius: 4px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
  font-family: monospace; /* Fuente monoespaciada para la estructura */
  overflow-x: auto; /* Permitir desplazamiento horizontal si es necesario */
  white-space: pre; /* Mantener el formato del texto preformateado */
}
</style>
