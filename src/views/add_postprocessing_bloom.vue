<template>
    <div w="100%" h="100%" ref="box" id="box"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { ref, onMounted, onUnmounted } from 'vue'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const box = ref<HTMLElement>();

onMounted(() => {
    const width = box.value?.offsetWidth || 0;
    const height = box.value?.offsetHeight || 0;
    const container = box.value
    let object: any;
    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
    camera.position.z = 290;

    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer()
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container?.appendChild(renderer.domElement)

    // 光照
    const light = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(light);

    function loadModel() {
        object.traverse(function (child: any) {
            if (child.isMesh) child.material.map = texture;
        });
        object.position.y = - 95;
        object.layers.set(0);
        scene.add(object);
    }

    const manager = new THREE.LoadingManager(loadModel);

    // texture
    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load('/public/examples/textures/blue.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    const loader = new OBJLoader(manager);
    loader.load('/public/examples/models/obj/male02/male02.obj', function (obj) {
        object = obj
    });

    const boxgeometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 'red' })
    const mesh = new THREE.Mesh(boxgeometry, material)
    mesh.name = '立方体'
    mesh.position.x = 50;
    mesh.layers.set(1)
    scene.add(mesh)

    const options = {
        exposure: 3.8,
        bloomStrength: 0.7,
        bloomThreshold: 0,
        bloomRadius: 0.38,
    };
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
    bloomPass.threshold = options.bloomThreshold;
    bloomPass.strength = options.bloomStrength;
    bloomPass.radius = options.bloomRadius;
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    function render() {
        const delta = clock.getDelta();
        if (object) {
            object.rotation.y += delta * 0.5
        }
        texture.offset.y += 1 / 12;

        renderer.autoClear = false;
        renderer.clear()

        camera.layers.set(0)
        bloomComposer.render();
        renderer.clearDepth()

        camera.layers.set(1)
        renderer.render(scene, camera)
        requestAnimationFrame(render);
    }

    render()
})
</script>
    
<style>

</style>