<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import Stage from '@/components/Stage';
import * as THREE from 'three';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement>()

onMounted(() => {
    const stage = new Stage(container.value, 0, 10, 10);
    const { scene, renderer } = stage

    const grid = new THREE.GridHelper(10)
    scene.add(grid)

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    const AxesHelper = new THREE.AxesHelper(5)
    scene.add(AxesHelper)

    const dz = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2), new THREE.MeshPhongMaterial({ color: 'orange', wireframe: true }))
    scene.add(dz)

    container.value?.append(renderer.domElement)
    stage.animate()
})

</script>
    
<style></style>