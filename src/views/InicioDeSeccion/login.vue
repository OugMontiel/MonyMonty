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
  background-color: #f0f4f8; /* Color de fondo suave */
  height: 100vh;
  font-family: 'Arial', sans-serif; /* Fuente más moderna */
}

.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  height: 80%;
  background: #ffffff; /* Fondo blanco */
  border-radius: 15px; /* Bordes más redondeados */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); /* Sombra más suave */
}

.login-login,
.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
  padding: 20px; /* Espaciado interno */
}

.login-login {
  width: 35%;
  background-color: #f8f9fa; /* Fondo gris claro */
  border-radius: 15px; /* Bordes redondeados */
  color: black; /* Texto blanco */
}

.login-info {
  width: 55%;
  background-color: #f8f9fa; /* Fondo gris claro */
  border-radius: 15px; /* Bordes redondeados */
}

.divider {
  height: 60vh;
  width: 1.5px;
  background-color: #e0e0e0; /* Color gris claro */
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
  width: 100%; /* Asegura que ocupe todo el ancho */
}

.login-form-datos div {
  margin-bottom: 15px; /* Espaciado entre campos */
}

.login-form h2 {
  margin: 0 0 5px; /* Espaciado para los títulos */
  font-size: 1.2em; /* Tamaño de fuente más grande */
}

.login-form input {
  width: 100%; /* Ocupa todo el ancho */
  padding: 10px; /* Espaciado interno */
  border: 1px solid #ced4da; /* Borde gris */
  border-radius: 5px; /* Bordes redondeados */
  font-size: 1em; /* Tamaño de fuente */
}

.login-form input:focus {
  border-color: #007bff; /* Color de borde al enfocar */
  outline: none; /* Sin contorno */
}

.login-form-buton {
  margin-top: 20px; /* Espaciado superior */
}

.login-form button {
  padding: 10px 20px; /* Espaciado interno */
  background-color: #28a745; /* Color verde */
  color: white; /* Texto blanco */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar */
  font-size: 1em; /* Tamaño de fuente */
  transition: background-color 0.3s; /* Transición suave */
}

.login-form button:hover {
  background-color: #218838; /* Color verde más oscuro al pasar */
}

.login-info section {
  margin-bottom: 2em;
  text-align: left; /* Alineación a la izquierda */
}

.login-logo {
  max-width: 150px; /* Ajusta el tamaño del logo según sea necesario */
}

.login-footer {
  text-align: center;
  
  width: 100%;
  padding: 10px 0; /* Espaciado interno */
  font-size: 0.9em; /* Tamaño de fuente más pequeño */
  color: #6c757d; /* Color gris */
}
</style>
