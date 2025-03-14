<template>
  <section class="titulo.home">
    <h1>MonyMonty</h1>
    <blockquote>
      "La riqueza consiste mucho más en disfrutar que en poseer". - Aristóteles
    </blockquote>
  </section>

  <section class="introduction.home">
    <p>
      MonyMonty es una iniciativa que surgió debido a la falta de educación
      financiera dentro de mi núcleo familiar.
    </p>
  </section>

  <section class="problem.home">
    <h2>¿Por qué es importante la educación financiera?</h2>
    <p>
      y Así como en mi familia, es común en muchas otras que la educación
      financiera no esté presente.
    </p>

    <p>
      Es un problema que afecta a las familias, pero es más bien una carencia
      generalizada en la sociedad colombiana y latinoamericana. La falta de
      conocimientos financieros limita la habilidad de las personas para
      administrar eficazmente sus finanzas personales, lo cual puede resultar en
      dificultades económicas y endeudamiento. Además, esta carencia afecta el
      desarrollo económico y la estabilidad financiera de nuestras comunidades y
      países en general.
    </p>
  </section>

  <section class="solution.home">
    <h2>¿Qué es MonyMonty?</h2>

    <p>
      En MonyMonty ofrecemos una solución integral que abarca tres aspectos
      clave: Educación, Control y Gestión, todos diseñados para un manejo
      eficiente de sus finanzas personales.
    </p>
    <ul>
      <li>
        <strong>Educación:</strong> Proporcionamos a nuestros usuarios técnicas
        y métodos que mejoran sus habilidades y conocimientos en finanzas
        personales. Nuestro objetivo es empoderar a los usuarios con el
        conocimiento necesario para tomar decisiones financieras informadas.
      </li>
      <li>
        <strong>Control:</strong> Ofrecemos un sistema interactivo e intuitivo
        que permite a cada usuario llevar el registro detallado de sus
        transacciones financieras. Con nuestro sistema, los usuarios pueden ver
        a dónde se destina cada peso, establecer metas financieras, controlar
        sus inversiones y mucho más.
      </li>
      <li>
        <strong>Gestión:</strong> Nos enfocamos en conectar a nuestros usuarios
        con mentores o expertos financieros capacitados. A través de estos
        expertos, nuestros usuarios pueden aprovechar al máximo nuestro sistema
        y siempre contarán con asesoramiento financiero directo y personalizado.
      </li>
    </ul>

    <p>
      Con MonyMonty estamos ofreciendo mucho más que una simple aplicación.
      Estamos construyendo una comunidad amigable y comprometida en capacitar a
      las personas para alcanzar una salud financiera óptima. ¡Nos encantaría
      que te unas a nosotros y comiences a tomar el control de tu futuro
      financiero hoy mismo!
    </p>
  </section>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.titulo.home {
  text-align: center;
  margin-bottom: 20px;
}

blockquote {
  font-style: italic;
  color: #555;
  margin: 10px 0;
}

.introduction.home,
.problem.home,
.solution.home {
  margin-bottom: 30px;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
