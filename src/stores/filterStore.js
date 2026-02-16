export const useFilterStore = defineStore("filter", () => {
  const state = reactive({
    dateRange: [],
    accounts: [],
    currencies: [],
    categories: [],
  });

  function setFilters(partial) {
    Object.assign(state, partial);
  }

  function resetFilters(defaults) {
    Object.assign(state, defaults);
  }

  return {
    state,
    setFilters,
    resetFilters,
  };
});
