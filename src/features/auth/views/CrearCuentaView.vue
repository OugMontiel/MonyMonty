<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";
import Footer from "@/components/web/footer.vue";

export default {
  name: "RegisterForm",
  data() {
    const hoy = new Date();
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return {
      logo,

      nombre: "",
      apellido: "",
      dia: hoy.getDate(),
      mes: meses[hoy.getMonth()],
      año: hoy.getFullYear().toString(),
      genero: "",
      email: "",
      contraseña: "",
      showRules: false,
    };
  },
  computed: {
    rules() {
      return {
        length: this.contraseña.length >= 8,
        uppercase: /[A-Z]/.test(this.contraseña),
        number: /\d/.test(this.contraseña),
        symbol: /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(this.contraseña),
      };
    },
  },
  components: {Footer},
  methods: {
    irALogin() {
      this.$router.push("/");
    },
    esMayorDeEdad() {
      const dia = parseInt(this.dia);
      const mes = this.obtenerIndiceMes(this.mes); // enero = 0, febrero = 1, etc.
      const año = parseInt(this.año);

      if (!dia || mes === null || !año) return false;

      const fechaNacimiento = new Date(año, mes, dia);
      const hoy = new Date();

      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mesActual = hoy.getMonth();
      const diaActual = hoy.getDate();

      if (edad > 18 || (edad === 18 && (mesActual > mes || (mesActual === mes && diaActual >= dia)))) {
        return true;
      }
      return false;
    },
    obtenerIndiceMes(mesNombre) {
      const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const index = meses.indexOf(mesNombre.toLowerCase());
      return index >= 0 ? index : null;
    },
    irARegistarse() {
      if (!this.esMayorDeEdad()) {
        alert("Debes ser mayor de 18 años para registrarte.");
        return;
      }
    },
    irAPrivacidad() {
      alert("privacidad");
    },
    irACondiciones() {
      alert("Condiciones");
    },
  },
};
</script>

<template>
  <div class="logo-section">
    <img :src="logo" alt="Icono de la aplicación" class="logo-icon" />
  </div>
  <div class="form-container">
    <div class="card">
      <div class="card-text">
        <h2 class="card-h2">Crea una cuenta</h2>
        <p>Es rápido y fácil.</p>
      </div>

      <div class="row">
        <input type="text" placeholder="Nombre" v-model="nombre" />
        <input type="text" placeholder="Apellido" v-model="apellido" />
      </div>

      <label>Fecha de nacimiento</label>
      <div class="row">
        <select v-model="dia">
          <option v-for="n in 31" :key="n" :value="n">{{ n }}</option>
        </select>
        <select v-model="mes">
          <option value="enero">Enero</option>
          <option value="febrero">Febrero</option>
          <option value="marzo">Marzo</option>
          <option value="abril">Abril</option>
          <option value="mayo">Mayo</option>
          <option value="junio">Junio</option>
          <option value="julio">Julio</option>
          <option value="agosto">Agosto</option>
          <option value="septiembre">Septiembre</option>
          <option value="octubre">Octubre</option>
          <option value="noviembre">Noviembre</option>
          <option value="diciembre">Diciembre</option>
        </select>
        <select v-model="año">
          <option v-for="n in 100" :key="n" :value="new Date().getFullYear() - n">
            {{ new Date().getFullYear() - n }}
          </option>
        </select>
      </div>

      <label>Género</label>
      <div class="genero-container">
        <label class="genero-opcion">
          <input type="radio" value="Mujer" v-model="genero" />
          <span>Mujer</span>
        </label>
        <label class="genero-opcion">
          <input type="radio" value="Hombre" v-model="genero" />
          <span>Hombre</span>
        </label>
      </div>
      <div class="correo-container">
        <input type="email" placeholder="Correo electrónico" v-model="email" class="" />
        <input
          type="password"
          v-model="contraseña"
          placeholder="Ingresa tu contraseña"
          class="password-input"
          @focus="showRules = true"
          @blur="showRules = false"
        />
        <!-- Alerta flotante de reglas -->
        <div v-if="showRules" class="rules-alert">
          <p :class="rules.length ? 'valid' : 'invalid'">✔ Mínimo 8 caracteres</p>
          <p :class="rules.uppercase ? 'valid' : 'invalid'">✔ Una letra mayúscula</p>
          <p :class="rules.number ? 'valid' : 'invalid'">✔ Un número</p>
          <p :class="rules.symbol ? 'valid' : 'invalid'">✔ Un símbolo ($#%&...)</p>
        </div>
      </div>
      <div class="password-container"></div>

      <p class="text-small">
        Al hacer clic en "Registrarte", aceptas nuestras
        <span class="text-condicionesypoliticas" @click="irACondiciones">Condiciones</span> , la
        <span class="text-condicionesypoliticas" @click="irAPrivacidad">Política de privacidad</span>. Es posible que te enviemos
        notificaciones por SMS, que puedes desactivar cuando quieras.
      </p>

      <button type="submit" @click="irARegistarse" class="register-button">Registrarte</button>

      <p @click="irALogin" class="forgot-login">¿Ya tienes una cuenta?</p>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
/* ---Logo--- */

.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px;
}

.logo-icon {
  width: 150px;
  height: auto;
}

/* ---Ajuste General--- */

.form-container {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.card {
  width: 22%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
  justify-content: center;
  align-items: center;
}

/* ---Logo--- */
.card-text {
  align-items: center;
}

/* ---Nombre y apellido--- */
.row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccd0d5;
  border-radius: 6px;
  width: 100%;
  margin-top: 5px;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

.text-small {
  font-size: 10px;
  color: #606770;
  margin-bottom: 10px;
}

.genero-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.genero-opcion {
  position: relative;
  border: 1px solid #ccd0d5;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  background-color: #fff;
  transition: border-color 0.3s;
}

.genero-opcion input[type="radio"] {
  margin-right: 8px;
  accent-color: #1877f2;
}

.genero-opcion input[type="radio"]:checked + span {
  font-weight: bold;
}

.genero-opcion:hover {
  border-color: #1877f2;
}

.correo-container {
  margin-bottom: 20px;
}

.register-button {
  background-color: #42b72a;
  color: white;
  width: 100%;
  padding: 13px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px 0;
}

.register-button:hover {
  border: 0.5px #1877f2 solid;
}

.login-link {
  text-align: center;
  color: #1877f2;
  font-size: 14px;
  cursor: pointer;
}

.text-condicionesypoliticas {
  color: #1877f2;
  font-size: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: center;
}

.text-condicionesypoliticas {
  text-decoration: underline;
}

.forgot-login {
  color: #1877f2;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: center;
}

.forgot-login:hover {
  text-decoration: underline;
}

.password-container {
  display: flex;
  gap: 15px;
  align-items: start;
}

.password-input {
  padding: 8px;
  font-size: 16px;
  width: 220px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.rules-alert {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 280px;
  margin-top: 10px;
  padding: 12px;
  background-color: #fff8dc;
  border: 1px solid #ffc107;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.rules-alert p {
  margin: 6px 0;
  font-size: 14px;
}

.valid {
  color: green;
  font-weight: bold;
}

.invalid {
  color: red;
}
/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  .card {
    max-width: 270px;
    margin: 30px auto;
    background-color: #f3f3f3;
    padding: 1.5em;
    border: 1px solid #c5c1c1;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .register-button {
    background-color: #42b72a;
    color: white;
    width: 100%;
    padding: 7px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin: 5px 0;
  }

  .register-button:hover {
    border: 0.5px #1877f2 solid;
  }

  .forgot-login {
    color: #1877f2;
    font-size: 10px;
    cursor: pointer;
    margin-bottom: 10px;
    text-align: center;
  }

  .forgot-login:hover {
    text-decoration: underline;
  }

  .footer-p {
    font-style: italic;
    font-size: 15px;
    color: #333;
  }
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {
}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {
}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {
}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {
}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {
}
</style>
