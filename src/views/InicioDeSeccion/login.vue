<template>
  <div class="login">
    <div class="login.contentainer">
      <!-- Sección derecha -->
      <div class="login.container">
        <div class="login">
          <img :src="logo" alt="Icono de la aplicación" />

          <h2>Usuario</h2>
          <input type="text" v-model="username" placeholder="Ingresa tu usuario" />

          <h2>Contraseña</h2>
          <input type="password" v-model="password" placeholder="Ingresa tu contraseña" />

          <button @click="login">Iniciar Sesión</button>
        </div>
      </div>

      <!-- Sección izquierda -->
      <div class="login.info">
        <section>
          <box-icon name="home"></box-icon>

          <h2>¿Qué es nuestra aplicación?</h2>
          <p>Una innovadora solución SaaS para gestionar tus finanzas personales de manera eficiente y sencilla.</p>
        </section>

        <section>
          <box-icon name="home"></box-icon>
          <h2>Eslogan</h2>
          <p>"Tu camino hacia la libertad financiera comienza aquí."</p>
        </section>

        <section>
          <box-icon name="home"></box-icon>
          <h2>Características destacadas</h2>
          <ul>
            <li><strong>Asesorías personalizadas:</strong> Recibe orientación adaptada a tus necesidades financieras.</li>
            <li><strong>Asesorías grupales:</strong> Aprende y comparte experiencias con otros usuarios en sesiones interactivas.</li>
            <li>
              <strong>Gestión basada en teorías económicas modernas:</strong> Utilizamos enfoques actualizados para maximizar tu ahorro e
              inversión.
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- mensaje de pie de paguina -->
    <div class="login.footer">
      <p>"El dinero es un terrible amo pero un excelente sirviente." - P.T. Barnum</p>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";

export default {
  name: "Login",
  data() {
    return {
      logo,
      // Datos para el inicio de sesión
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username && this.password) {
        // Lógica para iniciar sesión
        console.log("Usuario:", this.username);
        console.log("Contraseña:", this.password);
        this.redirectToDashboard();
      } else {
        alert("Por favor, completa todos los campos.");
      }
    },
    redirectToDashboard() {
      // Lógica para redirigir al dashboard
      console.log("Redirigiendo al dashboard...");
    },
  },
};
</script>

<style scoped>
/* Estilos básicos opcionales */
</style>
