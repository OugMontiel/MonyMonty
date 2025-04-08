<!-- el backen tiene un structura exagonal con vertical ... y se va a ir actualizando y explicando que hace cada cosita  -->

<template>
  <div class="backend-structure">
    <h3 class="title">¿En Backend va así?</h3>
    <p class="intro">La estructura de carpetas del backend es la siguiente:</p>
    <pre class="structure">
      .
      ├── app.js
      ├── auth
      │   ├── application
      │   │   ├── controllers
      │   │   │   └── authController.js
      │   │   ├── routes
      │   │   │   └── authRouter.js
      │   │   ├── services
      │   │   │   └── authService.js
      │   │   └── validator
      │   │       └── authValidator.js
      │   ├── domain
      │   │   ├── models
      │   │   │   └── authModel.js
      │   │   └── repositories
      │   │       └── authRepository.js
      │   └── infrastructure
      │       ├── config
      │       │   └── passportGoogle.js
      │       ├── middleware
      │       │   └── isAuthenticated.js
      │       └── mongodb.js
      └── user
          ├── application
          │   ├── controllers
          │   │   └── userController.js
          │   ├── routes
          │   │   └── userRoutes.js
          │   ├── services
          │   │   └── userService.js
          │   └── validator
          │       └── userValidator.js
          ├── domain
          │   ├── models
          │   │   └── userModel.js
          │   └── repositories
          │       └── userRepository.js
          └── infrastructure
              └── mongodb.js
    </pre>
  </div>
</template>

<script>
export default {
  name: "EstructuraBackend",
};
</script>

<style scoped>
.backend-structure {
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
