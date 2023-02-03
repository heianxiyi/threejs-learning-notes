<template>
  <div class="w-300px h-100% b-r-solid border-r border-#444 flex flex-col">
    <div class="text-24px font-bold text-#049ef4 p-15px">three.js</div>
    <div
      class="py-10px b-t b-b border-t-solid border-b-solid border-#444 flex items-center px-10px group"
    >
      <div
        class="i-ic-baseline-search text-24px text-#bbb group-focus-within:!hidden"
        :class="{ '!hidden': displayValue != '' }"
      ></div>
      <input
        ref="refInput"
        :value="displayValue"
        @input="onChange"
        type="text"
        class="h-24px text-16px flex-1 border-transparent bg-transparent text-#bbb font-bold focus-visible:outline-none"
      />
      <div
        class="i-ic-outline-close text-24px text-#bbb ml-5px cursor-pointer hidden"
        :class="[
          { '!block': displayValue != '' },
          { 'group-focus-within:!block': displayValue === '' },
        ]"
        @click="
          displayValue = '';
          refInput?.focus();
        "
      ></div>
    </div>
    <div v-if="list" class="overflow-y-auto flex-1">
      <div class="px-15px" v-for="group in data">
        <div class="font-bold my-16px text-#049ef4">
          {{ group.name }}
        </div>
        <div class="children">
          <div
            class="mb-16px overflow-hidden group cursor-pointer border-rd-4px border-3 border-solid border-transparent"
            :class="{
              '!border-#049ef4 border-3 border-solid': route.name === item,
            }"
            v-for="item in group.data"
            @click="go(item)"
          >
            <div class="leading-0">
              <img
                class="w-100% object-cover h-150px"
                :src="`/screenshots/${item}.jpg`"
              />
            </div>
            <div
              class="px-10px py-8px text-#bbb bg-#2e2e2e font-bold group-hover:text-#049ef4"
            >
              {{ item.replace(group.name, "").slice(1).replaceAll("_", " / ") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, unref } from "vue";
import { useRouter, useRoute } from "vue-router";
interface listProps {
  [key: string]: string[];
}
interface dataProps {
  name: string;
  data: string[];
}
const router = useRouter();
const route = useRoute();
const list = ref<listProps>();
const refInput = ref<HTMLInputElement>();
const displayValue = ref("");
const data = computed(() => {
  const orign = unref(list);
  const keywords = unref(displayValue);
  if (orign) {
    const r: dataProps[] = [];
    for (const key in orign) {
      const element = orign[key];
      if (keywords) {
        const rr = element.filter((i) => i.indexOf(keywords) > -1);
        if (rr.length > 0) {
          r.push({ name: key, data: rr });
        }
      } else {
        r.push({ name: key, data: element });
      }
    }
    return r;
  }
  return [];
});

function onChange(e: Event) {
  const { value } = e.target as HTMLInputElement;
  displayValue.value = value;
  if (value) {
    history.replaceState({ q: value }, "", `?q=${value}`);
  } else {
    history.replaceState({ q: "" }, "", route.path);
  }
}
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
      displayValue.value = route.query.q ? (route.query.q as string) : "";
    });
});
</script>
