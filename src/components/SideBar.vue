<template>
  <div class="w-300px h-100% b-r-solid border-r border-#444 flex flex-col">
    <div class="text-24px font-bold text-#049ef4 p-15px">three.js</div>
    <div class="py-15px b-t b-b border-t-solid border-b-solid border-#444">
      <div class="i-ic-baseline-search text-24px text-#bbb px-16px"></div>
    </div>
    <div v-if="list" class="overflow-y-auto flex-1">
      <div class="px-15px" v-for="group in Object.keys(list)">
        <div class="font-bold my-16px text-#049ef4">
          {{ group }}
        </div>
        <div class="children">
          <div
            class="mb-16px overflow-hidden group cursor-pointer border-rd-4px"
            v-for="item in list[group]"
            @click="go(item)"
          >
            <div class="leading-0">
              <img class="w-100%" :src="`/screenshots/${item}.jpg`" />
            </div>
            <div
              class="p-10px text-#bbb bg-#2e2e2e font-bold group-hover:text-#049ef4"
            >
              {{ item.replace(group, "").slice(1).replaceAll("_", " / ") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
interface listProps {
  [key: string]: string[];
}
const list = ref<listProps>();
const router = useRouter();
function go(name: string) {
  router.push({
    name: name,
  });
}
onBeforeMount(() => {
  fetch("/files.json")
    .then((data) => data.json())
    .then((res) => {
      list.value = res;
    });
});
</script>
