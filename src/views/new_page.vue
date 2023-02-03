<template>
    <div w="100%" h="100%" ref="box" id="box"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { ref, onMounted } from 'vue'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

const box = ref<HTMLElement>();

onMounted(() => {
    const width = box.value?.offsetWidth || 0;
    const height = box.value?.offsetHeight || 0;
    const container = box.value
    const gui = new GUI()

    let object: THREE.Group;

    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
    camera.position.z = 290;

    const scene = new THREE.Scene()
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    function loadModel() {

        object.traverse(function (child: any) {

            if (child.isMesh) child.material.map = texture;

        });

        object.position.y = - 95;
        scene.add(object);
    }

    const manager = new THREE.LoadingManager(loadModel);

    // texture
    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load('/public/blue.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    console.log(texture, 444);


    new OBJLoader(manager)
        .load('/public/examples/models/obj/male02/male02.obj', function (obj) {
            object = obj
        });

    const renderer = new THREE.WebGLRenderer()
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container?.appendChild(renderer.domElement)

    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);


    const params = {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 0
    };
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false; //不渲染到屏幕
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);


    const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById("vertexshader")!.textContent || undefined, // 顶点着色器
            fragmentShader: document.getElementById("fragmentshader")!.textContent || undefined, // 片元着色器
            defines: {}
        }), 'baseTexture'
    );
    finalPass.needsSwap = true;
    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene)
    finalComposer.addPass(finalPass);


    const boxgeometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 'red' })
    const mesh = new THREE.Mesh(boxgeometry, material)
    mesh.name = '立方体'
    mesh.position.x = 50;
    scene.add(mesh)


    // gui.add(params, 'exposure', 0.1, 2).onChange(function (value) {

    //     renderer.toneMappingExposure = Math.pow(value, 4.0);

    // });

    // gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {

    //     bloomPass.threshold = Number(value);

    // });

    // gui.add(params, 'bloomStrength', 0.0, 3.0).onChange(function (value) {

    //     bloomPass.strength = Number(value);

    // });

    // gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {

    //     bloomPass.radius = Number(value);

    // });

    function animate() {
        render();
        requestAnimationFrame(animate);
    }


    const materials: any = {};
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
    function darkenMaterial(obj: any) {
        if ((obj.isMesh) && bloomLayer.test(obj.layers) === false) {
            if (obj.name === '立方体') {
                materials[obj.uuid] = obj.material;
                obj.material = darkMaterial;
            }
        }

    }
    function restoreMaterial(obj: any) {
        if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];
        }
    }
    function render() {
        const delta = clock.getDelta();
        if (object) {
            object.rotation.y += delta * 0.5
        }
        // renderer.render(scene, camera);
        texture.offset.y += 1 / 12;

        scene.traverse(darkenMaterial);
        bloomComposer.render();
        scene.traverse(restoreMaterial);
        finalComposer.render()
    }

    animate()
})
</script>
    
<style>

</style>