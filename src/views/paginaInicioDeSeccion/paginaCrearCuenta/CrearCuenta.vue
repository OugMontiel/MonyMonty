<script>

import logo from "@/assets/img/MonyMontySinFondo3.png";
import Footer from "@/components/web/footer.vue";



export default {
  name: "RegisterForm",
  data() {
    return {
      logo,

      nombre: "",
      apellido: "",
      dia: "",
      mes: "",
      año: "",
      genero: "",
      email: "",
      contraseña: "",
    };
  },
  methods: {
    irALogin() {
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <div class="form-container">
    <div class="logo-section">
    <img :src="logo" alt="Icono de la aplicación" class="logo-icon" />
  </div>
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
          <option value="enero">enero</option>
          <option value="febrero">febrero</option>
          <option value="marzo">marzo</option>
          <option value="abril">abril</option>
          <option value="mayo">mayo</option>
          <option value="junio">junio</option>
          <option value="julio">julio</option>
          <option value="agosto">agosto</option>
          <option value="septiembre">septiembre</option>
          <option value="octubre">octubre</option>
          <option value="noviembre">noviembre</option>
          <option value="diciembre">diciembre</option>
        </select>
        <select v-model="año">
          <option v-for="n in 100" :key="n" :value="2025 - n">{{ 2025 - n }}</option>
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

      <input type="email" placeholder="Correo electrónico" v-model="email"  class=""/>
      <input type="password" placeholder="Contraseña nueva" v-model="contraseña" />

      <p class="text-small">Al hacer clic en "Registrarte", aceptas nuestras Condiciones, la Política de privacidad y...
      </p>

      <button class="register-button">Registrarte</button>

      <p @click="irALogin" class="forgot-login">¿Ya tienes una cuenta?</p>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}


.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 150px;
  height: auto;
}
.card {
  width: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
}
.card-text{
  align-items: center;
}


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
  font-size: 12px;
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
  accent-color: #1877f2; /* color del círculo seleccionado */
}

.genero-opcion input[type="radio"]:checked + span {
  font-weight: bold;
}

.genero-opcion:hover {
  border-color: #1877f2;
}

.register-button {
  background-color: #42b72a;
  color: white;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 15px 0;
}

.login-link {
  text-align: center;
  color: #1877f2;
  font-size: 14px;
  cursor: pointer;
}

.forgot-login {
  color: #1877f2;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
}

.forgot-login:hover {
  text-decoration: underline;
}

</style>
