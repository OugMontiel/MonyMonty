<template>
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
</template>

<script>
import QueEsMonyMonty from "../components/content/QueEsMonyMonty.vue";
import Instalacion from "../components/content/Instalacion.vue";
import DefinicionDeCarpetas from "../components/content/DefinicionDeCarpetas.vue";
import carpetaBackend from "../components/content/carpetaBackend.vue";
import carpetaFrontend from "../components/content/carpetaFrontend.vue";

export default {
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
        }
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
