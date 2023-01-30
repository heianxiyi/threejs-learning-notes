import { createApp } from "vue";
import "./style.css";
import "uno.css";
import { router } from "./router";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
