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
  components: { Footer },
  methods: {
    cancelar() {
      this.$router.push('/');
    },
    buscarCuenta() {
      this.$router.push('/');
    },
  }
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

      <input type="text" placeholder="Correo electrónico" class="input-text" />

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
  margin-top: 50px; 
  margin-bottom: 20px;
}

.logo-icon {
  width: 150px; 
  height: auto;
}

.form-section {
  padding-top: 20px;
  background-color: #e0e0e0;  
}

/* Card principal */
.card {
  max-width: 500px;
  margin: 40px auto;
  background-color: #f3f3f3;
  padding: 1.5em;
  border: 1px solid #c5c1c1;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.text-h2 {
  font-size: 1.2em;
  margin-bottom: 0.5em;
}

.text-p {
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

.divider {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 15px 0;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
  margin: 15px 0;
}

.btn-cancelar {
  background-color: #e4e6eb;  
  color: #050505;
  border: none;
  padding: 15px 25px;
  border-radius: 6px;
  border: 1px solid #9b9b9b;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancelar:hover {
  background-color: #d8dadf;
}

.btn-buscar {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 6px;
  border: 1px solid #1666cf;
  font-weight: bold;
  cursor: pointer;
}

.btn-buscar:hover {
  background-color: #166fe5;
}

.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 40px;
  text-align: center;
}

.footer-p {
  font-style: italic;
  font-size: 20px;
  color: #333;
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
@media (min-width: 768px) and (max-width: 991.98px) {}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {}
</style>
