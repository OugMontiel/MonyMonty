
<script>
import QueEsMonyMonty from "@/components/documentacion/queEsMonyMonty.vue";
import Instalacion from "@/components/documentacion/instalacion.vue";
import DefinicionDeCarpetas from "@/components/documentacion/definicionDeCarpetas.vue";
import carpetaBackend from "@/components/documentacion/carpetaBackend.vue";
import carpetaFrontend from "@/components/documentacion/carpetaFrontend.vue";

import Footer from "@/components/web/footer.vue";
import Header from "@/components/web/header.vue";

export default {
  name: "vista para toda la documentacion",
  components: {Header, Footer},
  data() {
    return {
      topics: [
        {
          id: 1,
          title: "MonyMonty",
          subtopics: [
            {id: 1, title: "¿Qué es MonyMonty?", component: QueEsMonyMonty},
            {id: 2, title: "Instalación", component: Instalacion},
          ],
        },
        {
          id: 2,
          title: "Estructura de Carpetas backend",
          subtopics: [
            {id: 3, title: "Arbol de carpetas", component: DefinicionDeCarpetas},
            {id: 4, title: "backend", component: carpetaBackend},
            {id: 5, title: "frontend", component: carpetaFrontend},
          ],
        },
      ],
      currentComponent: null,
    };
  },
  methods: {
    selectTopic(topic) {
      this.currentComponent = topic.subtopics[0].component; // Selecciona el primer subtema por defecto
    },
    selectSubtopic(subtopic) {
      this.currentComponent = subtopic.component;
    },
  },
  mounted() {
    this.currentComponent = this.topics[0].subtopics[0].component; // Selecciona el primer subtema por defecto
  },
};
</script>

<template>
  <Header />
  <div class="documentation-view">
    <div class="sidebar">
      <h2>Temas</h2>
      <ul>
        <li v-for="topic in topics" :key="topic.id">
          <a @click="selectTopic(topic)">{{ topic.title }}</a>
          <ul>
            <li v-for="subtopic in topic.subtopics" :key="subtopic.id">
              <a @click="selectSubtopic(subtopic)">{{ subtopic.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content">
      <component :is="currentComponent"></component>
    </div>
  </div>
  <Footer />
</template>




<style scoped>
.documentation-view {
  display: flex;
}

.sidebar {
  width: 30%;
  padding: 20px;
  background-color: #f4f4f4;
}

.content {
  width: 70%;
  padding: 20px;
}
</style>
