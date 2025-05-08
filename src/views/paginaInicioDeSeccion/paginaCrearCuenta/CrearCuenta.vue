<script>
export default {
  name: "RecuperarCuenta",
  methods: {
    cancelar() {
      console.log("Cancelar presionado");
    },
    buscarCuenta() {
      console.log("Buscar presionado");
    },
    iniciarSesion() {
      console.log("Redirigir a login...");
    },
    registrarCuenta() {
      console.log("Redirigir a registro...");
    }
  }
};
</script>

<template>
  <div class="pagina-recuperar">
    <!-- NAV -->
    <nav class="barra-nav">
      <div class="logo">facebook</div>
      <div class="form-login">
        <input type="text" placeholder="Correo o teléfono" />
        <input type="password" placeholder="Contraseña" />
        <button class="btn-azul" @click="iniciarSesion">Iniciar sesión</button>
        <a class="registro-link" href="#" @click.prevent="registrarCuenta">Registrar cuenta</a>
      </div>
    </nav>

    <!-- FORMULARIO PRINCIPAL -->
    <div class="recuperar-cuenta-card">
      <h2>Recupera tu cuenta</h2>
      <p>Ingresa tu correo electrónico o número de celular para buscar tu cuenta.</p>

      <input
        type="text"
        placeholder="Correo electrónico o número de celular"
        class="input-text"
      />

      <div class="acciones">
        <button class="btn-cancelar" @click="cancelar">Cancelar</button>
        <button class="btn-buscar" @click="buscarCuenta">Buscar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estructura general */
.pagina-recuperar {
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* Barra de navegación */
.barra-nav {
  background-color: #ffffff;
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.logo {
  font-size: 1.6em;
  font-weight: bold;
  color: #1877f2;
}

.form-login {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.form-login input {
  padding: 0.4em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
}

.btn-azul {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 0.4em 1em;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.btn-azul:hover {
  background-color: #166fe5;
}

.registro-link {
  font-size: 0.9em;
  color: #1877f2;
  text-decoration: none;
  cursor: pointer;
}

.registro-link:hover {
  text-decoration: underline;
}

/* Card principal */
.recuperar-cuenta-card {
  max-width: 400px;
  margin: 80px auto;
  background: #fff;
  padding: 1.5em;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recuperar-cuenta-card h2 {
  font-size: 1.2em;
  margin-bottom: 0.5em;
}

.recuperar-cuenta-card p {
  font-size: 0.95em;
  color: #555;
  margin-bottom: 1em;
}

.input-text {
  width: 100%;
  padding: 0.7em;
  margin-bottom: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95em;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
}

.btn-cancelar {
  background-color: #e4e6eb;
  color: #050505;
  border: none;
  padding: 0.5em 1.2em;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-buscar {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 0.5em 1.2em;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancelar:hover {
  background-color: #d8dadf;
}

.btn-buscar:hover {
  background-color: #166fe5;
}
</style>
