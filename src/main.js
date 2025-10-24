import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from 'primevue/floatlabel';
import DatePicker from 'primevue/datepicker';
import Password from "primevue/password";
import Divider from "primevue/divider";
import Message from "primevue/message";
import {Form} from "@primevue/forms";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: "system",
    },
  },
});

app.component("Button", Button);
app.component("InputText", InputText);
app.component("FloatLabel", FloatLabel);
app.component("DatePicker", DatePicker);
app.component("Password", Password);
app.component("Divider", Divider);
app.component("Card", Card);
app.component("Message", Message);
app.component("Form", Form);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Avatar", Avatar);
app.component("Badge", Badge);

app.mount("#app");
