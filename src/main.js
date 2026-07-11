import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";
import {initAuth} from "./bootstrap/initAuth";
import {registerPrimeVue} from "./plugins/primevue/primevue";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

await initAuth();

app.use(router);

registerPrimeVue(app);

app.mount("#app");
