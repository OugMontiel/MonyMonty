import {createApp} from "vue";
import App from "./App.vue";

// .use
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

// .component
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Password from "primevue/password";
import Divider from "primevue/divider";
import Message from "primevue/message";
import {Form, FormField} from "@primevue/forms";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Toast from "primevue/toast";
import AutoComplete from "primevue/autocomplete";
import MultiSelect from "primevue/multiselect";
import Drawer from "primevue/drawer";
import SpeedDial from "primevue/speeddial";
import Tooltip from "primevue/tooltip";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";
import ProgressBar from "primevue/progressbar";

import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import ColorPicker from "primevue/colorpicker";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  ripple: true,
  inputStyle: "outlined",
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
      dark: false,
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

app.component("Button", Button);
app.component("InputText", InputText);
app.component("FloatLabel", FloatLabel);
app.component("DatePicker", DatePicker);
app.component("Password", Password);
app.component("Divider", Divider);
app.component("Card", Card);
app.component("Message", Message);
app.component("Form", Form);
app.component("FormField", FormField);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Avatar", Avatar);
app.component("Badge", Badge);
app.component("Toast", Toast);
app.component("AutoComplete", AutoComplete);
app.component("MultiSelect", MultiSelect);
app.component("Drawer", Drawer);
app.component("SpeedDial", SpeedDial);
app.component("Tooltip", Tooltip);
app.component("Dialog", Dialog);
app.component("InputNumber", InputNumber);
app.component("Textarea", Textarea);
app.component("Select", Select);
app.component("SelectButton", SelectButton);
app.component("ColorPicker", ColorPicker);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Skeleton", Skeleton);
app.component("Tag", Tag);
app.component("ProgressBar", ProgressBar);

app.directive("tooltip", Tooltip);

app.mount("#app");
