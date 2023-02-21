<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import Stage from '@/components/Stage';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement>()

onMounted(() => {
    const stage = new Stage(container.value, 196, 113, -194)
    const { scene, renderer } = stage

    const point = new THREE.PointLight(0xffffff, 1, 100)
    scene.add(point)

    const light = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(light);

    const loader = new GLTFLoader()
    loader.load('/temp/buk_missile_system/scene.gltf', (gltf) => {
        const model = gltf.scene
        model.scale.set(10, 10, 10)
        scene.add(model)
        console.log(scene, 444);
    });
    const grid = new THREE.GridHelper(500, 100, 0xffffff, 0xffffff)
    scene.add(grid);
    stage.beforeRender = () => { }
    container.value?.appendChild(renderer.domElement)
    stage.animate()
})
</script>
    
<style></style>