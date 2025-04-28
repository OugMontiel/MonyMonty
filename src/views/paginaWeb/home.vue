<script>
import Header from "@/components/web/header.vue";
import Footer from "@/components/web/footer.vue";

export default {
  name: "Home",
  components: {Header, Footer},
};
</script>

<template>
  <Header />

  <section id="inicio">
    <section class="titulo.home">
      <h1>MonyMonty</h1>
      <blockquote>"La riqueza consiste mucho más en disfrutar que en poseer". - Aristóteles</blockquote>
    </section>
  </section>

  <section id="nosotros">
    <section class="introduction.home">
      <p>MonyMonty es una iniciativa que surgió debido a la falta de educación financiera dentro de mi núcleo familiar.</p>
    </section>

    <section class="problem.home">
      <h2>¿Por qué es importante la educación financiera?</h2>
      <p>y Así como en mi familia, es común en muchas otras que la educación financiera no esté presente.</p>

      <p>
        Es un problema que afecta a las familias, pero es más bien una carencia generalizada en la sociedad colombiana y latinoamericana. La
        falta de conocimientos financieros limita la habilidad de las personas para administrar eficazmente sus finanzas personales, lo cual
        puede resultar en dificultades económicas y endeudamiento. Además, esta carencia afecta el desarrollo económico y la estabilidad
        financiera de nuestras comunidades y países en general.
      </p>
    </section>
  </section>

  <section id="productos">
    <section class="solution.home">
      <h2>¿Qué es MonyMonty?</h2>

      <p>
        En MonyMonty ofrecemos una solución integral que abarca tres aspectos clave: Educación, Control y Gestión, todos diseñados para un
        manejo eficiente de sus finanzas personales.
      </p>
      <ul>
        <li>
          <strong>Educación:</strong> Proporcionamos a nuestros usuarios técnicas y métodos que mejoran sus habilidades y conocimientos en
          finanzas personales. Nuestro objetivo es empoderar a los usuarios con el conocimiento necesario para tomar decisiones financieras
          informadas.
        </li>
        <li>
          <strong>Control:</strong> Ofrecemos un sistema interactivo e intuitivo que permite a cada usuario llevar el registro detallado de
          sus transacciones financieras. Con nuestro sistema, los usuarios pueden ver a dónde se destina cada peso, establecer metas
          financieras, controlar sus inversiones y mucho más.
        </li>
        <li>
          <strong>Gestión:</strong> Nos enfocamos en conectar a nuestros usuarios con mentores o expertos financieros capacitados. A través
          de estos expertos, nuestros usuarios pueden aprovechar al máximo nuestro sistema y siempre contarán con asesoramiento financiero
          directo y personalizado.
        </li>
      </ul>

      <p>
        Con MonyMonty estamos ofreciendo mucho más que una simple aplicación. Estamos construyendo una comunidad amigable y comprometida en
        capacitar a las personas para alcanzar una salud financiera óptima. ¡Nos encantaría que te unas a nosotros y comiences a tomar el
        control de tu futuro financiero hoy mismo!
      </p>
    </section>
  </section>

  <section id="clientes">
    <h2>Clientes</h2>
    <p>Contenido de la sección Clientes.</p>
  </section>

  <section id="contacto">
    <h2>Contacto</h2>
    <p>Contenido de la sección Contacto.</p>
  </section>

  <Footer />
</template>

<style scoped>
/* 🔹 Estilo general */
section {
  max-width: 900px; /* Se centra el contenido */
  margin: 0 auto;
  padding: 20px;
  text-align: justify;
}

/* 🔹 Título principal */
.titulo.home {
  text-align: center;
  margin-bottom: 50px;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

blockquote {
  font-style: italic;
  color: #555;
  margin: 10px 0;
  text-align: center;
}

/* 🔹 Secciones */
.introduction.home,
.problem.home,
.solution.home {
  margin-bottom: 40px;
}

/* 🔹 Subtítulos */
h2 {
  font-size: 2rem;
  color: #222;
  margin-bottom: 10px;
  text-align: center;
}

/* 🔹 Párrafos */
p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

/* 🔹 Lista de características */
ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  background: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

ul li strong {
  color: #000;
  font-size: 1.1rem;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  /* Estilos para móviles pequeños */
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para móviles medianos/grandes */
  section {
    padding: 15px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  p {
    font-size: 1rem;
  }

  ul li {
    flex-direction: column;
    text-align: center;
  }
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
