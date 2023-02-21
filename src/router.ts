import { createRouter, createWebHistory } from "vue-router";
import defaultView from "./components/defaultView.vue";
import WebglAnimationKeyframes from "./views/webgl_animation_keyframes.vue";
import WebglTitanCard from "./views/webgl_titan_card.vue";
import AddPostprocessingBloom from "./views/add_postprocessing_bloom.vue";
import AddRandomBox from "./views/add_random_box.vue";
import NewPage from "./views/new_page.vue";
import AddAnimationDemo1 from "./views/add_animation_demo1.vue";
import AddFlowerRain from "./views/add_flower_rain.vue";
import AddBirthdayCake from "./views/add_birthday_cake.vue";
import AddPanorama from "./views/add_panorama.vue";
import AddHouse from "./views/add_house.vue";
import AddAnimationRotationStar from "./views/add_animation_rotation_star.vue";
import AddRickandmorty from "./views/add_rickAndMorty.vue";
import AddModelMissileCarrier from "./views/add_model_missile_carrier.vue";
import AddFireRing from "./views/add_fire_ring.vue";
import AddGalaxy from "./views/add_galaxy.vue";
import AddTank from "./views/add_tank.vue";
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
    {
      path: "/add_random_box",
      name: "add_random_box",
      component: AddRandomBox,
    },
    {
      path: "/add_animation_demo1",
      name: "add_animation_demo1",
      component: AddAnimationDemo1,
    },
    {
      path: "/add_flower_rain",
      name: "add_flower_rain",
      component: AddFlowerRain,
    },
    {
      path: "/add_birthday_cake",
      name: "add_birthday_cake",
      component: AddBirthdayCake,
    },
    {
      path: "/add_panorama",
      name: "add_panorama",
      component: AddPanorama,
    },
    {
      path: "/add_house",
      name: "add_house",
      component: AddHouse,
    },
    {
      path: "/add_animation_rotation_star",
      name: "add_animation_rotation_star",
      component: AddAnimationRotationStar,
    },
    {
      path: "/add_rickAndMorty",
      name: "add_rickAndMorty",
      component: AddRickandmorty,
    },
    {
      path: "/add_model_missile_carrier",
      name: "add_model_missile_carrier",
      component: AddModelMissileCarrier,
    },
    {
      path: "/add_fire_ring",
      name: "add_fire_ring",
      component: AddFireRing,
    },
    {
      path: "/add_galaxy",
      name: "add_galaxy",
      component: AddGalaxy,
    },
    {
      path: "/add_tank",
      name: "add_tank",
      component: AddTank,
    },
  ],
});
