<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="w-100vw h-100vh flex">
    <SideBar />
    <div class="relative flex items-center justify-center flex-1 w-0">
      <router-view></router-view>
      <div
        class="absolute cursor-pointer w-40px h-40px bg-white flex items-center justify-center border-rd-100% right-15px bottom-15px shadow">
        <div class="i-ic-baseline-code text-22px text-#444"></div>
      </div>
    </div>
    <div
      class="fixed right-10px top-10px cursor-pointer w-40px h-40px bg-white flex items-center justify-center border-rd-100% right-15px bottom-15px shadow"
      @click="router.push('/')">
      <div class="i-ic-round-home text-28px text-#444"></div>
    </div>
  </div>
</template>

<style>
body,
html {
  margin: 0;
}

canvas {
  display: block;
}
</style>
