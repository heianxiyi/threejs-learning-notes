<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const container = ref<HTMLElement>()

onMounted(() => {
    const w = container.value?.offsetWidth || 0;
    const h = container.value?.offsetHeight || 0;

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000)
    const renderer = new THREE.WebGL1Renderer()

    camera.lookAt(scene.position)
    camera.position.set(0, 0, 100)
    renderer.setSize(w, h)
    container.value?.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    const urls = [
        "/public/examples/textures/panorama/home.left.jpg",
        "/public/examples/textures/panorama/home.right.jpg",
        "/public/examples/textures/panorama/home.top.jpg",
        "/public/examples/textures/panorama/home.bottom.jpg",
        "/public/examples/textures/panorama/home.front.jpg",
        "/public/examples/textures/panorama/home.back.jpg",
    ]
    const cubeTexture = new THREE.CubeTextureLoader().load(urls);
    scene.background = cubeTexture;

    function render() {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    render()

    // 一般的照片只是一个方向的画面，而全景图是上下左右前后 360 度的画面，它能立体的记录拍照位置的场景。

    // 全景图需要专门的工具来浏览，我们可以用 Three.js 来实现。原理就是通过立方体贴 6 张图（也叫天空盒），或者通过球体贴一张大图，把相机设置在中间，转动相机就可以看到不同方向的画面。

    // 其实实现全景图浏览更简单的方式是直接给 Scene 设置立方体纹理，不用再单独创建立方体或球体，用 CubeTextureLoader 加载六张图，设置到 Scene 的背景上就行。

    // 还要设置下相机，加上轨道控制器，通过渲染器一帧帧的渲染出来，这样就实现了全景图浏览的功能。

    // 至于那六张贴图，通过 PTGui 或者类似的工具就可以裁切出来。

    // 全景图浏览一共也没几行代码，但是这个功能还是很有用的。如果你会拍全景图，那就更棒了，可以把生活中一些场景立体的记录下来，自己写一个工具来浏览。
})

</script>
    
<style>

</style>