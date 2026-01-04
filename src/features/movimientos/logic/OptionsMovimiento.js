import {ref} from "vue";
import axios from "axios";
import {_} from "lodash";
import {useToast} from "primevue/usetoast";

const API_URL = import.meta.env.VITE_API_URL;

const movementTypes = ref([
  {label: "Ingreso", value: "INGRESO"},
  {label: "Egreso", value: "EGRESO"},
  {label: "Transferencia", value: "TRANSFERENCIA"},
]);
const entidades = ref([
  {_id: "1", nombre: "Banco Demo", tipo: "BANCO"},
  {_id: "2", nombre: "Efectivo Demo", tipo: "EFECTIVO"},
]);
const categorias = ref([
  {_id: "cat1", categoria: "Comida Demo", subcategorias: [{_id: "sub1", subcategoria: "Restaurante Demo"}]},
  {_id: "cat2", categoria: "Transporte Demo", subcategorias: [{_id: "sub2", subcategoria: "Uber Demo"}]},
]);
const divisas = ref([
  {id: "USD", codigo: "USD", nombre: "Dolar Demo"},
  {id: "COP", codigo: "COP", nombre: "Peso Colombiano Demo"},
]);

export function useMovimientoOptions() {
  const loadingOptions = ref(false);
  const toast = useToast();

  const fetchOptions = async () => {
    loadingOptions.value = true;
    try {
      // TODO: Verify endpoints. Assuming standard REST structure based on resource names.
      const [entidadesRes, categoriasRes, divisasRes] = await Promise.all([
        // axios.get(`${API_URL}movimiento/types`, {withCredentials: true}), TODO: Add When service is ready
        axios.get(`${API_URL}entidad`, {withCredentials: true}),
        axios.get(`${API_URL}categoria`, {withCredentials: true}),
        axios.get(`${API_URL}divisa`, {withCredentials: true}),
      ]);

      if (_.isEmpty(entidadesRes?.data?.data) && _.isEmpty(categoriasRes?.data?.data) && _.isEmpty(divisasRes?.data?.data)) {
        return;
      } else {
        entidades.value = entidadesRes?.data?.data;
        categorias.value = categoriasRes?.data?.data;
        divisas.value = divisasRes?.data?.data;
      }
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las opciones. Por favor recarga la página.",
        life: 4000,
      });
    } finally {
      loadingOptions.value = false;
    }
  };

  return {
    movementTypes,
    entidades,
    categorias,
    divisas,
    fetchOptions,
    loadingOptions,
  };
}
