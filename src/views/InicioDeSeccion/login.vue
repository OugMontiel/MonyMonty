<template>
  <div class="login">
    <div class="login-container">
      <!-- Sección derecha -->
      <div class="login-login">
        <div class="login-form">
          <div class="login-form-logo">
            <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
          </div>
          <div class="login-form-datos">
            <div>
              <h2>Usuario</h2>
              <input type="text" v-model="username" placeholder="Ingresa tu usuario" />
            </div>
            <div>
              <h2>Contraseña</h2>
              <input type="password" v-model="password" placeholder="Ingresa tu contraseña" />
            </div>
          </div>
          <div class="login-form-buton">
            <button @click="login">Iniciar Sesión</button>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Sección izquierda -->
      <div class="login-info">
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
    <div class="login-footer">
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
      // variable del logo
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
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: red;
  height: 100vh;
}

.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  height: 80%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.login-login,
.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: blue;
  height: 90%;
}

.login-login {
  width: 35%;
}

.login-info {
  width: 55%;
}

.divider {
  height: 60vh;
  width: 1.5px;
  background-color: black;
}

.login-form {
  height: 90%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.login-form-datos {
  display: flex;
  flex-direction: column;
}

.login-info section {
  margin-bottom: 2em;
  text-align: center;
}

.login-logo {
  max-width: 150px; /* Ajusta el tamaño del logo según sea necesario */
}

.login-footer {
  text-align: center;

  background: rgba(255, 255, 255, 0.5); /* Fondo blanco con opacidad */
  width: 100%;
}
</style>
