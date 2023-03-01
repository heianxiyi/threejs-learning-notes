<template>
    <div w="100%" h="100%" ref="container">

    </div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, Ref, ref, unref } from 'vue';

const container = ref() as Ref<HTMLElement>;

onMounted(() => {
    const canvas = unref(container);
    const { clientWidth, clientHeight } = canvas;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(30, clientWidth / clientHeight);
    camera.position.set(0, 0, 12);

    const spheregeometry = new THREE.SphereGeometry(1, 32, 32);
    const a = new THREE.Points(spheregeometry, new THREE.PointsMaterial({ size: 0.02 }));
    scene.add(a)

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
        controls.update();
        a.rotation.y += 0.02
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate)

})
</script>
    
<style></style>