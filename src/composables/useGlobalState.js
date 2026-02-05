import {ref} from "vue";

// Estado global compartido (Singleton)
const globalDataRefreshTrigger = ref(0);

export function useGlobalState() {
  /**
   * Dispara una actualización global.
   * Cualquier componente que observe globalDataRefreshTrigger reaccionarà.
   */
  const triggerGlobalRefresh = () => {
    globalDataRefreshTrigger.value++;
    console.log("Global refresh triggered:", globalDataRefreshTrigger.value);
  };

  return {
    globalDataRefreshTrigger,
    triggerGlobalRefresh,
  };
}
