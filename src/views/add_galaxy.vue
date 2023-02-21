<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement>()
onMounted(() => {
    const w = container.value?.offsetWidth || 0;
    const h = container.value?.offsetHeight || 0;

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, w / h);
    camera.up.set(0, 0, 1);
    camera.position.set(0, 50, 0)
    camera.lookAt(scene.position)

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    const DirectionalLight = new THREE.DirectionalLight(0xffffff, .5)
    scene.add(DirectionalLight)

    const renderer = new THREE.WebGL1Renderer()
    renderer.setSize(w, h)
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.value?.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    const rotations: any[] = [];

    const sphereGeometry = new THREE.SphereGeometry(1, 40, 40)

    const sunEarchScene = new THREE.Object3D()
    scene.add(sunEarchScene)
    rotations.push(sunEarchScene)

    const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xff9800, emissive: 0xf44336 })
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    sunMesh.scale.set(5, 5, 5)
    sunEarchScene.add(sunMesh)
    rotations.push(sunMesh)

    const earchMoonScene = new THREE.Object3D();
    earchMoonScene.position.x = 10;
    sunEarchScene.add(earchMoonScene);
    rotations.push(earchMoonScene);

    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
    earchMoonScene.add(earthMesh)
    rotations.push(earthMesh)

    // 添加月亮
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonMesh.position.x = 2;
    earchMoonScene.add(moonMesh);
    rotations.push(moonMesh);

    const AxesHelper = new THREE.AxesHelper(20)
    scene.add(AxesHelper)

    const render = (time: number) => {
        time *= 0.001;
        renderer.render(scene, camera);
        controls && controls.update();
        rotations.forEach(item => {
            item.rotation.y = time;
        })
        requestAnimationFrame(render)
    }

    render(0)
})
</script>
    
<style></style>