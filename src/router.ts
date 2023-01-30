import { createRouter, createWebHistory } from "vue-router";
import defaultView from "./components/defaultView.vue";
import WebglAnimationKeyframes from "./views/webgl_animation_keyframes.vue";
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: defaultView,
    },
    {
      path: "/webgl_animation_keyframes",
      name: "webgl_animation_keyframes",
      component: WebglAnimationKeyframes,
    },
  ],
});
