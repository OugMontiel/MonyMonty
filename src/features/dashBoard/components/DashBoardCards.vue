<script setup>
import {Icon} from "@iconify/vue";

defineProps({
  stats: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- CARDS -->
    <Card v-for="(item, index) in stats" :key="index" class="cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <template #title>
        <div class="flex justify-between items-center">
          <Message severity="contrast" variant="simple">
            {{ item.label }}
          </Message>

          <!-- icono -->
          <Icon :icon="item.icon" class="w-5 h-5" @click.stop="item.redirect && item.redirect()" />
        </div>
      </template>

      <template #content>
        <h2 class="text-3xl font-bold mt-2">
          <span v-if="isLoading">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </span>
          <span v-else>
            <Message severity="success" variant="simple">
              {{ item.value }}
            </Message>
          </span>
        </h2>
      </template>
    </Card>
  </div>
</template>
