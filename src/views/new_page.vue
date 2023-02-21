<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement>()

onMounted(() => {
    const w = container.value?.offsetWidth || 0;
    const h = container.value?.offsetHeight || 0;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xbbbbbb)
    const camera = new THREE.PerspectiveCamera(4, w / h)
    camera.lookAt(scene.position)
    camera.position.set(196, 113, -194);

    const axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper);

    const light = new THREE.AmbientLight(0xffffff, .4);
    scene.add(light)

    const point = new THREE.PointLight(0xffffff, 1, 100)
    scene.add(point)

    const grid = new THREE.GridHelper(500, 100, 0xffffff, 0xffffff)
    scene.add(grid);

    const renderer = new THREE.WebGL1Renderer()
    renderer.setSize(w, h)
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.value?.appendChild(renderer.domElement)

    // const environment = new RoomEnvironment()
    // const pmremGenerator = new THREE.PMREMGenerator(renderer)
    // scene.environment = pmremGenerator.fromScene(environment).texture;

    const controls = new OrbitControls(camera, renderer.domElement)

    window.onresize = function () {
        const w = container.value?.offsetWidth || 0;
        const h = container.value?.offsetHeight || 0;
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
    }

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/examples/jsm/libs/draco/')
    loader.setDRACOLoader(dracoLoader)

    // loader.load('/temp/scud_v5.3/scene.gltf', (gltf) => {
    //     console.log(gltf, 44);
    //     const model = gltf.scene
    //     scene.add(model)
    // })
    loader.load('/temp/buk_missile_system/scene.gltf', (gltf) => {
        const model = gltf.scene
        scene.add(model)
    });
    // loader.load('/temp/desert_scud_missile_launcher.glb', (gltf) => {
    //     console.log(gltf, 44);
    //     const model = gltf.scene
    //     scene.add(model)
    // })

    (window as any).camera = camera;

    function render() {
        renderer.render(scene, camera)
        controls.update()
        requestAnimationFrame(render)
    }

    render()
})
</script>
    
<style></style>