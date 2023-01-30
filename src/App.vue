<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="w-100vw h-100vh flex">
    <SideBar />
    <div class="flex-1 flex items-center justify-center">
      <router-view></router-view>
    </div>
    <div
      class="i-ic-round-home text-28px text-#bbb fixed right-10px top-10px cursor-pointer"
      @click="router.push('/')"
    ></div>
  </div>
</template>
