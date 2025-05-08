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
    irARecuperarCuenta(){
      this.$router.push('/recuperarCuenta');
    },
    irACrearCuenta(){
      this.$router.push('/crearNuevaCuenta');
    },
  },
};
</script>

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
            <input
            type="text"
            v-model="emailOrPhone"
            placeholder="Correo electrónico o número de teléfono"
            class="login-input"
          />
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
            class="login-input"
          />
          </div>
          <button @click="iniciarSesion" class="login-button">
            Iniciar sesión
          </button>
          <p @click="irARecuperarCuenta" class="forgot-password">
            ¿Olvidaste tu contraseña?
          </p>
          <hr />
          <button @click="irACrearCuenta" class="create-button">
            Crear cuenta nueva
          </button>
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
            <li><strong>Asesorías personalizadas:</strong> Recibe orientación adaptada a tus necesidades financieras.
            </li>
            <li><strong>Asesorías grupales:</strong> Aprende y comparte experiencias con otros usuarios en sesiones
              interactivas.</li>
            <li>
              <strong>Gestión basada en teorías económicas modernas:</strong> Utilizamos enfoques actualizados para
              maximizar tu ahorro e
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

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #f0f4f8;
  height: 100vh;
  font-family: "Arial", sans-serif;
}

.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 70%;
  height: 60%;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.login-login,
.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
  padding: 20px;
}

.login-login {
  width: 35%;
  background-color: #f8f9fa;
  border-radius: 15px;
  color: black;
}

.login-info {
  width: 55%;
  background-color: #f8f9fa;
  border-radius: 15px;
}

.divider {
  height: 60vh;
  width: 1.5px;
  background-color: #e0e0e0;
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
  width: 100%;
}

.login-form-datos div {
  margin-bottom: 15px;
}

.login-form h2 {
  margin: 0 0 5px;
  font-size: 1.2em;
}

.login-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 1em;
}

.login-form input:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
  width: 100%;
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.login-button:hover {
  background-color: #166fe5;
}
.forgot-password {
  color: #1877f2;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.create-button {
  width: 100%;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #36a420;
}
.login-info section {
  margin-bottom: 2em;
  text-align: left;
  /* Alineación a la izquierda */
}

.login-logo {
  max-width: 150px;
  /* Ajusta el tamaño del logo según sea necesario */
}

.login-footer {
  text-align: center;

  width: 100%;
  padding: 10px 0;
  /* Espaciado interno */
  font-size: 0.9em;
  /* Tamaño de fuente más pequeño */
  color: #6c757d;
  /* Color gris */
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  /* Estilos para móviles pequeños */
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para móviles medianos/grandes */
}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos para tablets */
}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para laptops */
}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {
  /* Estilos para pantallas grandes */
}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {
  /* Estilos para pantallas muy grandes */
}
</style>
