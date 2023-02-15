<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement>();

onMounted(() => {
    const w = container.value?.offsetWidth || 0;
    const h = container.value?.offsetHeight || 0;

    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(w, h)

    container.value?.appendChild(renderer.domElement)
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#1a1a1a', 1, 1200)
    scene.background = new THREE.Color('#1a1a1a')

    const camera = new THREE.PerspectiveCamera(40, w / h)
    camera.lookAt(scene.position);
    camera.position.set(20, 100, 550);
    scene.add(camera);

    (window as any).camera = camera

    const light = new THREE.AmbientLight('#deedff', 1.5);
    scene.add(light)

    const controls = new OrbitControls(camera, renderer.domElement)

    const starMaterial = new THREE.MeshLambertMaterial({ color: '#03c03c', wireframe: true })
    const starGeometry = new THREE.SphereGeometry(80, 32, 32)
    const starCube = new THREE.Mesh(starGeometry, starMaterial)
    scene.add(starCube)

    const torusMaterial = new THREE.MeshLambertMaterial({ color: '#40a9ff', wireframe: true })
    const torusGeometry = new THREE.TorusGeometry(140, 8, 2, 120)
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.rotation.x = Math.PI / 2
    torus.rotation.y = (Math.PI / 2) * 0.1
    scene.add(torus)

    const icoGeometry = new THREE.IcosahedronGeometry(16, 1)
    const icoMaterial = new THREE.MeshLambertMaterial({ color: '#fffc00', wireframe: true })
    const icoCube = new THREE.Mesh(icoGeometry, icoMaterial)
    icoCube.position.set(170, 110, 0)
    scene.add(icoCube)

    const stars = new THREE.Group()
    for (let index = 0; index < 500; index++) {
        const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0)
        const material = new THREE.MeshToonMaterial({ color: '#eeeeee' })
        const cube = new THREE.Mesh(geometry, material)
        cube.position.x = (Math.random() - 0.5) * 700
        cube.position.y = (Math.random() - 0.5) * 700
        cube.position.y = (Math.random() - 0.5) * 700
        cube.rotation.x = Math.PI * Math.random() * 2
        cube.rotation.y = Math.PI * Math.random() * 2
        cube.rotation.z = Math.PI * Math.random() * 2
        stars.add(cube)
    }
    scene.add(stars)

    const axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)

    // const axios = new THREE.Vector3(0, 0, 1)
    let rot = 0;
    function render() {
        renderer.render(scene, camera)
        controls.update()
        starCube && (starCube.rotation.y += 0.005)
        torus && (torus.rotation.z += 0.008)
        // torus && (torus.rotateOnAxis(axios, Math.PI / 400))

        rot += Math.random() * 0.8;
        const radian = (rot * Math.PI) / 180;
        // console.log(radian, 2);
        icoCube.position.x = 160 * Math.sin(radian);
        icoCube.position.y = 120 * Math.cos(radian);
        icoCube.position.z = -120 * Math.cos(radian);

        icoCube.rotation.x += 0.005;
        icoCube.rotation.y += 0.005;
        icoCube.rotation.z -= 0.005;

        stars.rotation.y += 0.0009;
        stars.rotation.z -= 0.0003;

        requestAnimationFrame(render)
    }
    render()
    window.onresize = () => {
        const w = container.value?.offsetWidth || 0;
        const h = container.value?.offsetHeight || 0;
        renderer.setSize(w, h);
        // 更新相机
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
})
</script>
    
<style>

</style>