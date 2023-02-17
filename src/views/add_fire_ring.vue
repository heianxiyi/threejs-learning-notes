<template>
    <div w="100%" h="100%" ref="container" class="box"></div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as THREE from './lib/three.module.js';
import { Fire } from './lib/Fire.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from "@tweenjs/tween.js";

const container = ref<HTMLElement>()

function init() {
    const w = container.value?.offsetWidth || 0;
    const h = container.value?.offsetHeight || 0;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = true;
    container.value?.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.set(0, 0, 100)
    camera.lookAt(scene.position)

    const light = new THREE.AmbientLight(0xffffff)
    scene.add(light)

    window.onresize = function () {
        const w = container.value?.offsetWidth || 0;
        const h = container.value?.offsetHeight || 0;
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
    }

    const ring = new Fire(new THREE.PlaneGeometry(20, 25), {
        textureWidth: 800,
        textureHeight: 1000,
        debug: false,
    });
    ring.setSourceMap(new THREE.TextureLoader().load('/add/fire-ring/ring.png'));
    ring.color1 = new THREE.Color(0xffffff);
    ring.color2 = new THREE.Color(0xf59e00);
    ring.color3 = new THREE.Color(0x08120a);
    ring.colorBias = .6;
    // 燃烧效果
    ring.burnRate = 10;
    // 模糊效果ring
    ring.diffuse = 1;
    ring.viscosity = .5;
    ring.expansion = -1.6;
    ring.swirl = 10;
    ring.drag = 0.4;
    ring.airSpeed = 18;
    ring.windX = 0.1;
    ring.windY = 0.2;
    ring.speed = 100;
    ring.massConservation = false;
    ring.position.y = 4;
    ring.position.z = -6;
    scene.add(ring);

    const controls = new OrbitControls(camera, renderer.domElement);
    var tween = new TWEEN.Tween({
        x1: camera.position.x, // 相机x
        y1: camera.position.y, // 相机y
        z1: camera.position.z, // 相机z
        x2: controls.target.x, // 控制点的中心点x
        y2: controls.target.y, // 控制点的中心点y
        z2: controls.target.z, // 控制点的中心点z
    });
    tween.to({
        x1: 0,
        y1: 0,
        z1: 22,
        x2: 0,
        y2: 0,
        z2: 0,
    },
        2400
    );
    tween.onUpdate(function (object: any) {
        camera.position.x = object.x1;
        camera.position.y = object.y1;
        camera.position.z = object.z1;
        controls.target.x = object.x2;
        controls.target.y = object.y2;
        controls.target.z = object.z2;
        controls.update();
    });
    tween.onComplete(function () {
        controls.enabled = true;
    });
    tween.easing(TWEEN.Easing.Cubic.InOut);
    tween.start();

    let step = 0;
    const render = () => {
        requestAnimationFrame(render)
        renderer.render(scene, camera)
        step += .03;
        tween && tween.update()
        ring && (ring.position.y = Math.abs(2.2 + Math.sin(step)))
    }
    render()
}

onMounted(() => {
    init()
})
</script>
    
<style lang="less" scoped>
.box {
    background: url("/add/fire-ring/bg.webp") no-repeat center;
    background-size: cover;

    &::after {
        display: inline-block;
        content: "";
        width: 60%;
        padding-top: 16.23%;
        background: url("/add/fire-ring/logo.png") no-repeat center;
        background-size: 100% auto;
        left: 50%;
        margin-left: -24%;
        bottom: 1%;
        position: fixed;
        filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, .2));
    }
}
</style>