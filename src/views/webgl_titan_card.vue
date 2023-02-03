<template>
    <div bg="#ffeebb" w="100%" h="100%" ref="box"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { onMounted, ref } from 'vue'

const box = ref<HTMLElement>();

onMounted(() => {
    const container = box.value;
    const width = box.value?.offsetWidth || 0;
    const height = box.value?.offsetHeight || 0;

    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container?.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffeebb')

    const camera = new THREE.PerspectiveCamera(35, width / height, 1, 100)
    camera.position.set(20, 10, -40);

    const controls = new OrbitControls(camera, renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambient);
    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(0, 100, 0);
    scene.add(pointLight); //点光源添加到场景中


    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/public/examples/jsm/libs/draco/gltf/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load("/public/examples/models/add/nissan_titan.glb", (gltf) => {
        const model = gltf.scene;
        model.position.set(1, 3, 0);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model)
        animate()
    })

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update()
        renderer.render(scene, camera)
    }
})
</script>
    
<style>

</style>