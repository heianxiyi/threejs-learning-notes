<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { ref, onMounted, render } from 'vue';
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
const container = ref<HTMLElement>()

onMounted(() => {
    const width = container.value?.offsetWidth || 0;
    const height = container.value?.offsetHeight || 0;

    const s = 200
    const k = width / height

    const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

    const fontLoader = new FontLoader();

    const scene = new THREE.Scene()

    const cake = new THREE.Group()

    const renderer = new THREE.WebGL1Renderer();

    const axesHelper = new THREE.AxesHelper(200)

    scene.add(axesHelper)

    const controls = new OrbitControls(camera, renderer.domElement);

    function create() {
        renderer.setSize(width, height);
        renderer.setClearColor('white', 1);
        container.value?.appendChild(renderer.domElement);

        camera.position.set(100, 100, 300);
        camera.lookAt(scene.position);

        const light = new THREE.AmbientLight('white')
        scene.add(light)

        const cake1 = new THREE.TextureLoader().load('/public/examples/textures/cake/cake1.png')
        const cake2 = new THREE.TextureLoader().load('/public/examples/textures/cake/cake2.png')
        const cake3 = new THREE.TextureLoader().load('/public/examples/textures/cake/cake3.png')
        const cake4 = new THREE.TextureLoader().load('/public/examples/textures/cake/cake4.png')

        const cakeMaterial1 = new THREE.MeshBasicMaterial({ map: cake1 })
        const cakeMaterial2 = new THREE.MeshBasicMaterial({ map: cake2 })
        const cakeMaterial3 = new THREE.MeshBasicMaterial({ map: cake3 })
        const cakeMaterial4 = new THREE.MeshBasicMaterial({ map: cake4 })

        const pinkMaterial = new THREE.MeshBasicMaterial({ color: 'pink' })

        const cakeGeometry1 = new THREE.CylinderGeometry(100, 100, 70, 40);
        const cakePart1 = new THREE.Mesh(cakeGeometry1, [cakeMaterial1, pinkMaterial, pinkMaterial])
        cakePart1.translateY(45)
        cake.add(cakePart1)

        const cakeGeometry2 = new THREE.CylinderGeometry(120, 120, 70, 40);
        const cakePart2 = new THREE.Mesh(cakeGeometry2, [cakeMaterial3, pinkMaterial, pinkMaterial])
        cakePart2.translateY(-25)
        cake.add(cakePart2)

        const cakeGeometry3 = new THREE.CylinderGeometry(140, 140, 60, 40);
        const cakePart3 = new THREE.Mesh(cakeGeometry3, [cakeMaterial2, pinkMaterial, pinkMaterial])
        cakePart3.translateY(-90)
        cake.add(cakePart3)

        const cakeGeometry4 = new THREE.CylinderGeometry(160, 160, 15, 40);
        const cakePart4 = new THREE.Mesh(cakeGeometry4, [cakeMaterial4, cakeMaterial4, cakeMaterial4])
        cakePart4.translateY(-120)
        cake.add(cakePart4)

        fontLoader.load('/public/examples/fonts/guang.typeface.json', (font) => {
            const textGeoMetry = new TextGeometry('赛赛', {
                font,
                size: 30,
                height: 5,
                bevelEnabled: true,
                bevelSize: 10
            })
            const textMaterial = ['white', 'orange'].map(color => new THREE.MeshBasicMaterial({ color }));

            const text = new THREE.Mesh(textGeoMetry, textMaterial)
            text.translateY(92)
            text.translateX(-45)
            cake.add(text);
        })

        scene.add(cake)
    }

    function render() {
        renderer.render(scene, camera)
        cake.rotation.y += 0.005
        controls.update()
        requestAnimationFrame(render)
    }
    create()
    render()
})
</script>
    
<style>

</style>