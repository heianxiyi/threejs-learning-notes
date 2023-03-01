<template>
    <div w="100%" h="100%" class="relative" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import Stage from '@/components/Stage';
import { Material } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'dat.gui';

const container = ref<HTMLElement>();
const gui = ref<GUI>()

onMounted(() => {
    const stage = new Stage(container.value, 4.25, 1.4, - 4.5, 1);
    const { scene, renderer } = stage;
    scene.background = new THREE.Color(0x333333)
    scene.environment = new RGBELoader().load('/examples/textures/equirectangular/venice_sunset_1k.hdr');
    scene.environment.mapping = THREE.EquirectangularReflectionMapping;
    scene.fog = new THREE.Fog(0x333333, 10, 15);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    container.value?.appendChild(renderer.domElement);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03, sheen: 0.5
    });

    const detailsMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 1.0, roughness: 0.5
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
    });

    gui.value = new GUI();
    (gui.value.domElement as any).style = 'position:absolute;left:50%;top:0;transform: translateX(-50%);'
    var f1 = gui.value.addFolder('Colors');
    const colors = { color1: 0xff0000, color2: 0xffffff, color3: 0xffffff }
    f1.addColor(colors, 'color1').name('车身').onChange(key => {
        bodyMaterial.color.set(key)
    });
    f1.addColor(colors, 'color2').name('轮毂').onChange(key => {
        detailsMaterial.color.set(key)
    });
    f1.addColor(colors, 'color3').name('挡风玻璃').onChange(key => {
        glassMaterial.color.set(key)
    });
    f1.open()

    container.value?.append(gui.value.domElement)

    const shadow = new THREE.TextureLoader().load('/examples/models/gltf/ferrari_ao.png');

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/jsm/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const wheels: any[] = [];
    loader.load('/examples/models/gltf/ferrari.glb', function (gltf: any) {
        const carModel = gltf.scene.children[0];

        carModel.getObjectByName('body').material = bodyMaterial;

        carModel.getObjectByName('rim_fl').material = detailsMaterial;
        carModel.getObjectByName('rim_fr').material = detailsMaterial;
        carModel.getObjectByName('rim_rr').material = detailsMaterial;
        carModel.getObjectByName('rim_rl').material = detailsMaterial;
        carModel.getObjectByName('trim').material = detailsMaterial;

        carModel.getObjectByName('glass').material = glassMaterial;

        wheels.push(
            carModel.getObjectByName('wheel_fl'),
            carModel.getObjectByName('wheel_fr'),
            carModel.getObjectByName('wheel_rl'),
            carModel.getObjectByName('wheel_rr')
        );
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
            new THREE.MeshBasicMaterial({
                map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
            })
        );
        mesh.rotation.x = - Math.PI / 2;
        mesh.renderOrder = 2;
        carModel.add(mesh);

        scene.add(carModel);
    });

    const { grid } = stage.viewHelp(40);
    (grid.material as Material).opacity = 0.2;
    (grid.material as Material).depthWrite = false;
    (grid.material as Material).transparent = true;
    // stage.addLight();
    stage.addStats();
    stage.beforeRender = () => {
        const time = - performance.now() / 1000;
        for (let i = 0; i < wheels.length; i++) {
            wheels[i].rotation.x = time * Math.PI * 2;
        }
        grid.position.z = - (time) % 1;
    }
    stage.animate();
})
</script>
    
<style></style>