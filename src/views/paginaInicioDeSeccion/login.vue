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
      alert("Redirigiendo al dashboard...");
      this.$router.push('/tablero');
    },
    irARecuperarCuenta() {
      this.$router.push('/recuperarCuenta');
    },
    irACrearCuenta() {
      this.$router.push('/crearCuenta');
    },

    irATablero() {
      this.$router.push('/tablero');
    },
  
  },
};
</script>

<template>
  <div class="login">
    <div class="login-container">
      <!-- Sección derecha -->
      <div class="login-card">
        <div class="login-form">

          <div class="login-form-logo">
            <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
          </div>

          <div class="login-form-datos">
            <input type="text" v-model="emailOrPhone" placeholder="Correo electrónico" class="login-input" />
            <input type="password" v-model="password" placeholder="Contraseña" class="login-input" />
          </div>

          <button @click="login" class="login-button">
            Iniciar sesión
          </button>

          <p @click="irARecuperarCuenta" class="forgot-password">
            ¿Olvidaste tu contraseña?
          </p>

          <div class="divider-buton"></div>

          <button @click="irACrearCuenta" class="create-button">
            Crear cuenta nueva
          </button>
          <button @click="irATablero" class="create-button">
            tablero prueba 
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Sección izquierda -->
      <div class="login-info">

        <section>
          <box-icon name="home"></box-icon>

          <h2 class="info-h2">¿Qué es nuestra aplicación?</h2>
          <p class="info-p">Una innovadora solución SaaS para gestionar tus finanzas personales de manera eficiente y
            sencilla.</p>
        </section>

        <section>
          <box-icon name="home"></box-icon>
          <h2 class="info-h2">Eslogan</h2>
          <p class="info-p">"Tu camino hacia la libertad financiera comienza aquí."</p>
        </section>

        <section>
          <box-icon name="home"></box-icon>
          <h2 class="info-h2">Características destacadas</h2>
          <ul>
            <li class="info-li"><strong>Asesorías personalizadas:</strong> Recibe orientación adaptada a tus necesidades
              financieras.
            </li>
            <li class="info-li"><strong>Asesorías grupales:</strong> Aprende y comparte experiencias con otros usuarios
              en sesiones interactivas.
            </li>
            <li class="info-li"><strong>Gestión basada en teorías económicas modernas:</strong> Utilizamos enfoques
              actualizados para
              maximizar tu ahorro einversión.
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- mensaje de pie de pagina -->
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

.login-logo {
  max-width: 150px;
}

.login-card,
.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
  padding: 20px;
}

.login-card {
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

.divider-buton {
  width: 100%;
  height: 2px;
  background-color: #e0e0e0;
}

.divider {
  height: 60vh;
  width: 2px;
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

.login-input {
  margin-bottom: 15px;
  margin: 5px 0;
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
}

.login-footer {
  text-align: center;
  width: 100%;
  padding: 10px 0;
  font-size: 0.9em;
  color: #6c757d;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {


  .login-container {
    flex-direction: column;
    width: 90%;
    height: auto;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .login-card,
  .login-info {
    width: 100%;
    height: auto;
    padding: 10px;
  }

  .login-form {
    width: 100%;
  }

  .login-form input {
    font-size: 14px;
  }

  .login-button,
  .create-button {
    font-size: 14px;
    padding: 8px;
  }

  .divider-buton {
    width: 50%;
    height: 5px;
    margin: 15px 0;
    background-color: #e0e0e0;
  }

  .divider {
    width: 100%;
    height: 2px;
    margin: 15px 0;
    background-color: #e0e0e0;
  }

  .login-info section {
    text-align: center;
    margin-bottom: 1rem;
  }

  .login-info h2,
  .info-p,
  .info-li {
    font-size: 12px;
  }


  .login-logo {
    max-width: 120px;
  }

  .login-footer {
    font-size: 12px;
    padding: 5px;
  }
}


/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {}
</style>
