<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref<HTMLElement>();

onMounted(() => {
    const width = container.value?.offsetWidth || 0;
    const height = container.value?.offsetHeight || 0;

    const scene = new THREE.Scene();

    const k = width / height;
    const s = 200;
    const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)

    const renderer = new THREE.WebGL1Renderer()

    camera.position.set(0, 200, 500)
    camera.lookAt(scene.position)

    renderer.setSize(width, height)
    renderer.setClearColor('white', 1)

    container.value?.appendChild(renderer.domElement)

    const petal = new THREE.Group()

    const f1 = new THREE.TextureLoader().load('/public/examples/textures/flower/flower1.png')
    const f2 = new THREE.TextureLoader().load('/public/examples/textures/flower/flower2.png')
    const f3 = new THREE.TextureLoader().load('/public/examples/textures/flower/flower3.png')
    const f4 = new THREE.TextureLoader().load('/public/examples/textures/flower/flower4.png')
    const f5 = new THREE.TextureLoader().load('/public/examples/textures/flower/flower5.png')
    const imglist = [f1, f2, f3, f4, f5]

    for (let i = 0; i < 400; i++) {
        let spriteMaterial = new THREE.SpriteMaterial({
            map: imglist[Math.floor(Math.random() * imglist.length)]
        })
        let sprite = new THREE.Sprite(spriteMaterial)
        petal.add(sprite)

        sprite.scale.set(40, 50, 1)
        sprite.position.set(2000 * (Math.random() - 0.5), 500 * Math.random(), 2000 * (Math.random() - 0.5))

    }
    scene.add(petal)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true;

    function render() {
        petal.children.forEach(sprite => {
            sprite.position.y -= 5;
            sprite.position.x += 0.5;
            if (sprite.position.y < - height / 2) sprite.position.y = height / 2
            if (sprite.position.x > 1000) sprite.position.x = -1000
        })
        controls.update()
        renderer.render(scene, camera)

        requestAnimationFrame(render)
    }

    render()

    window.onresize = function () {
        const width = container.value!.offsetWidth || 0;
        const height = container.value!.offsetHeight || 0;

        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };


})
</script>
    
<style>

</style>