<template>
    <div ref="container" w="100%" h="100%" position="relative">
        <div class="absolute bottom-40 w-100% flex justify-center gap-10">
            <button @click="move">平移</button>
            <button @click="rotation">旋转</button>
            <button @click="scale">缩放</button>
            <button @click="dance">跳跃</button>
            <button @click="operation">{{ stop? '启动': '暂停' }}</button>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'

const container = ref<HTMLElement>();
let move: any, rotation: any, scale: any, dance: any, operation: any
const stop = ref(false)
onMounted(() => {
    const scene = new THREE.Scene();

    const cubeGeoMetry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' })
    const cube = new THREE.Mesh(cubeGeoMetry, cubeMaterial)
    scene.add(cube)

    const width = container.value?.offsetWidth || 0;
    const height = container.value?.offsetHeight || 0;
    const renderer = new THREE.WebGL1Renderer()
    renderer.setSize(width, height)
    container.value?.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000)
    camera.position.set(6, 6, 6)
    camera.lookAt(scene.position)
    scene.add(camera)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    renderer.render(scene, camera)

    let step = 0;
    let animate: any;
    move = () => {
        if (stop.value) return
        if (cube.position.x >= 4) {
            step = -0.08
        }
        if (cube.position.x <= 0) {
            step = 0.08
        }
        cube.position.x += step

        renderer.render(scene, camera)
        animate = move
        requestAnimationFrame(move)
    }
    rotation = () => {
        if (stop.value) return

        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        cube.rotation.z += 0.01

        renderer.render(scene, camera)
        animate = rotation
        requestAnimationFrame(rotation)
    }
    scale = () => {
        if (stop.value) return

        cube.scale.x += step
        cube.scale.y += step
        cube.scale.z += step

        if (cube.scale.x >= 2) {
            step = -0.08
        }
        if (cube.scale.x <= 1) {
            step = 0.08
        }
        renderer.render(scene, camera)
        animate = scale
        requestAnimationFrame(scale)
    }
    dance = () => {
        if (stop.value) return
        step += 0.08

        cube.position.x = 4 * (Math.cos(step))

        cube.position.y = 3 * Math.abs(Math.sin(step))
        renderer.render(scene, camera)
        animate = dance
        requestAnimationFrame(dance)
    }
    operation = () => {
        if (stop.value) {
            stop.value = false
            animate()
        } else {
            stop.value = true
        }
    }
})
</script>
    
<style>

</style>