import { createRouter, createWebHistory } from "vue-router";
import defaultView from "./components/defaultView.vue";
import WebglAnimationKeyframes from "./views/webgl_animation_keyframes.vue";
import WebglTitanCard from "./views/webgl_titan_card.vue";
import AddPostprocessingBloom from "./views/add_postprocessing_bloom.vue";
import NewPage from "./views/new_page.vue";
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: defaultView,
    },
    {
      path: "/add_new_page",
      name: "add_new_page",
      component: NewPage,
    },
    {
      path: "/webgl_animation_keyframes",
      name: "webgl_animation_keyframes",
      component: WebglAnimationKeyframes,
    },
    {
      path: "/webgl_titan_card",
      name: "add_titan_card",
      component: WebglTitanCard,
    },
    {
      path: "/add_postprocessing_bloom",
      name: "add_postprocessing_bloom",
      component: AddPostprocessingBloom,
    },
  ],
});
