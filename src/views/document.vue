<!-- Aqui ... tenemos una vista con dos columnas, la primera lateral derecha con cada uno de los elementos que contiene cada uno de los temas y a su vez sus sub temas que se tratan en este repositorio  al otro lado, cada uno del respectivo contendio de cada uno de los temas y subtemas. --> 

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
      <h2>{{ selectedTopic.title }}</h2>
      <p>{{ selectedTopic.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      topics: [
        {
          id: 1,
          title: 'Introducción a Vue',
          subtopics: [
            { id: 1, title: '¿Qué es Vue?', content: 'Contenido sobre qué es Vue.' },
            { id: 2, title: 'Instalación', content: 'Contenido sobre cómo instalar Vue.' }
          ]
        },
        {
          id: 2,
          title: 'Componentes',
          subtopics: [
            { id: 3, title: 'Definición de Componentes', content: 'Contenido sobre cómo definir componentes.' },
            { id: 4, title: 'Props', content: 'Contenido sobre cómo usar props.' }
          ]
        }
      ],
      selectedTopic: {}
    };
  },
  methods: {
    selectTopic(topic) {
      this.selectedTopic = topic;
    },
    selectSubtopic(subtopic) {
      this.selectedTopic = subtopic;
    }
  },
  mounted() {
    this.selectedTopic = this.topics[0]; // Selecciona el primer tema por defecto
  }
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
