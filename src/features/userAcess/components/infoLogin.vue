<script>
export default {
  name: "InfoLogin",
};
</script>

<template>
  <div class="info">
    <!-- ¿Qué es nuestra aplicación? -->
    <section class="info__section">
      <box-icon name="bulb" type="solid" color="#ffcc00" size="md"></box-icon>
      <h2 class="info__title">¿Qué es nuestra aplicación?</h2>
      <p class="info__text">
        Una innovadora solución <strong>SaaS</strong> para gestionar tus finanzas personales de forma <strong>eficiente</strong> y <strong>sencilla</strong>.
      </p>
    </section>

    <!-- Eslogan (sin título) -->
    <section class="info__section">
      <box-icon name="rocket" type="solid" color="#ff9900" size="md"></box-icon>
      <p class="info__eslogan">
        "Tu camino hacia la <span>libertad financiera</span> comienza aquí."
      </p>
    </section>

    <!-- Características destacadas -->
    <section class="info__section">
      <box-icon name="star" type="solid" color="#ffcc00" size="md"></box-icon>
      <h2 class="info__title">Características destacadas</h2>
      <ul class="info__list">
        <li class="info__item"><strong>Asesorías personalizadas:</strong> orientación adaptada a tus necesidades financieras.</li>
        <li class="info__item"><strong>Asesorías grupales:</strong> aprende y comparte experiencias en sesiones interactivas.</li>
        <li class="info__item"><strong>Gestión moderna:</strong> teorías económicas actualizadas para maximizar tu ahorro e inversión.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.info {
  width: 100%;
  max-width: 720px;
  padding: 2rem;
  color: var(--texto-primario);
  font-family: 'Segoe UI', sans-serif;
  animation: fadeIn 0.8s ease-in;
}

.info__section {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.info__title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-letra-seleccion);
  margin-bottom: 0.3rem;
}

.info__text {
  font-size: 1rem;
  line-height: 1.6;
  color: #000000;
}

.info__eslogan {
  font-size: 1.2rem;
  font-weight: 600;
  font-style: italic;
  color: var(--color-letra-seleccion);
  background-color: rgba(255, 204, 0, 0.1);
  padding: 1rem;
  border-left: 4px solid #ff9900;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.info__eslogan span {
  color: var(--texto-primario);
  font-weight: bold;
}

.info__list {
  list-style-type: disc;
  padding-left: 1.2rem;
  color: var(--texto-primario);
}

.info__item {
  margin-bottom: 0.5rem;
  line-height: 1.5;
  transition: transform 0.3s ease, color 0.3s ease;
}

.info__item:hover {
  transform: translateX(6px);
  color: var(--color-letra-seleccion);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {

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
