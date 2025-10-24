<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";
import Footer from "@/components/web/footer.vue";

export default {
  name: "RecuperarCuenta",
  data() {
    return {
      // variable del logo
      logo,
    };
  },
  components: {Footer},
  methods: {
    cancelar() {
      this.$router.push("/");
    },
    buscarCuenta() {
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <div class="logo-section">
    <img :src="logo" alt="Icono de la aplicación" class="logo-icon" />
  </div>

  <div class="form-section">
    <div class="card">
      <h2 class="text-h2">Recupera tu cuenta</h2>
      <p class="text-p">Ingresa tu correo electrónico para buscar tu cuenta.</p>

      <input type="email" placeholder="Correo electrónico" class="input-text" />

      <div class="divider"></div>

      <div class="acciones">
        <button class="btn-cancelar" @click="cancelar">Cancelar</button>
        <button class="btn-buscar" @click="buscarCuenta">Buscar</button>
      </div>
    </div>

    <!-- mensaje de pie de pagina -->
    <div class="form-footer">
      <p class="footer-p">"El dinero es un terrible amo pero un excelente sirviente." - P.T. Barnum</p>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
/* Estructura general */
.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: var(--color-fondo-nav);
}

.logo-icon {
  width: 8rem;
  height: auto;
}

.form-section {
  padding: 1rem;
  background: var(--color-fondo);
}

/* Card principal */
.card {
  display: flex;
  flex-direction: column;
  max-width: 30%;
  height: 80%;
  margin: 7rem auto;
  background: var(--color-fondo-login);
  padding: 1.5em;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: 0 0.5rem 2rem var(--color-fondo-shadow);
}

.text-h2 {
  font-size: var(--font-size-titulo);
  margin-bottom: 0.5em;
}

.text-p {
  font-size: var(--font-size-text);
  color: var(--texto-secundario);
  margin-bottom: 1em;
}

.input-text {
  width: 100%;
  padding: 0.7em;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-botones);
  font-size: var(--font-size-input);
}

.input-text:focus {
  outline: none;
  border: 2px solid var(--color-fondo-input-activo);
}

.divider {
  width: 100%;
  height: 0.1rem;
  background: var(--color-fondo-linea);
  margin: 1rem 0;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
  margin: 1rem 0;
}

.btn-cancelar {
  background: var(--color-fondo-input);
  color: var(--texto-primario);
  border: none;
  padding: 10px 30px;
  border-radius: var(--border-radius-botones);
  border: 1px solid var(--color-border);
  font-weight: bold;
  font-size: var(--font-size-botones);
  cursor: pointer;
}

.btn-cancelar:hover {
  background: var(--color-fondo-input-activo);
}

.btn-buscar {
  background: var(--color-fondo-button);
  color: var(--texto-primario-Blanco);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: var(--border-radius-botones);
  border: 1px solid var(--color-fondo-button);
  font-weight: bold;
  font-size: var(--font-size-botones);
  cursor: pointer;
}

.btn-buscar:hover {
  background: var(--color-fondo-button-activo);
}

.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.footer-p {
  font-style: var(--font-family-base);
  font-size: var(--font-size-text);
  color: var(--texto-secundario);
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  .card {
    margin: 30px auto;
    padding: 1.5em;
    border: 1px solid var(--color-border);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .footer-p {
    font-style: italic;
    font-size: 15px;
    color: #333;
  }

  .btn-cancelar {
    padding: 10px 15px;
  }

  .btn-buscar {
    padding: 10px 20px;
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
