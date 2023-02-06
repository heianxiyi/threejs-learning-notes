import { createApp } from "vue";
import { router } from "./router";
import "./style.css";
import "uno.css";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
