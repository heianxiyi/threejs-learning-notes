<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import portalVertexShader from './shaders/vertex.js';
import portalFragmentShader from './shaders/fragment.js';
import { LatheGeometry } from 'three';

const container = ref<HTMLElement>()

onMounted(() => {
    const sizes = {
        width: container.value?.offsetWidth || 0,
        height: container.value?.offsetHeight || 0
    }
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    renderer.autoClear = false;
    renderer.setClearAlpha(0);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 2;
    container.value?.appendChild(renderer.domElement)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 10000);
    camera.position.set(0, 1, 7);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    // 最大仰角
    controls.minPolarAngle = .5;
    controls.maxPolarAngle = 2.5;
    // 水平旋转角度限制
    controls.minAzimuthAngle = -1;
    controls.maxAzimuthAngle = 1;

    // 页面缩放事件监听
    window.addEventListener('resize', () => {
        sizes.width = container.value?.offsetWidth || 0;
        sizes.height = container.value?.offsetHeight || 0;
        // 更新渲染
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        // 更新相机
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
    });

    // 光照
    const light = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(.25, 3, -1.25);
    scene.add(directionalLight);

    // 设置后期效果
    const options = {
        exposure: 2.8,
        bloomStrength: 2.39,
        bloomThreshold: 0,
        bloomRadius: 0.38,
        color0: [1, 5, 1],
        color1: [2, 20, 2],
        color2: [44, 97, 15],
        color3: [14, 28, 5],
        color4: [255, 255, 255],
        color5: [74, 145, 0],
    };

    const textureLoader = new THREE.TextureLoader();
    // 创建网格
    const portalGeometry = new THREE.PlaneGeometry(8, 8, 1, 1);
    const portalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                value: 0.0,
            },
            perlinnoise: {
                value: textureLoader.load('/public/examples/textures/RickAndMorty/perlinnoise.png'),
            },
            sparknoise: {
                value: textureLoader.load('/public/examples/textures/RickAndMorty/sparknoise.png'),
            },
            waterturbulence: {
                value: textureLoader.load('/public/examples/textures/RickAndMorty/waterturbulence.png'),
            },
            noiseTex: {
                value: textureLoader.load('/public/examples/textures/RickAndMorty/noise.png'),
            },
            color5: {
                value: new THREE.Vector3(...options.color5),
            },
            color4: {
                value: new THREE.Vector3(...options.color4),
            },
            color3: {
                value: new THREE.Vector3(...options.color3),
            },
            color2: {
                value: new THREE.Vector3(...options.color2),
            },
            color1: {
                value: new THREE.Vector3(...options.color1),
            },
            color0: {
                value: new THREE.Vector3(...options.color0),
            },
            resolution: {
                value: new THREE.Vector2(sizes.width, sizes.height)
            }
        },
        fragmentShader: portalFragmentShader,
        vertexShader: portalVertexShader
    });
    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.layers.set(1);
    scene.add(portal);

    // 更新材质
    const updateShaderMaterial = (deltaTime: number) => {
        portalMaterial.uniforms.time.value = deltaTime / 5000;
        portalMaterial.uniforms.color5.value = new THREE.Vector3(...options.color5);
        portalMaterial.uniforms.color4.value = new THREE.Vector3(...options.color4);
        portalMaterial.uniforms.color3.value = new THREE.Vector3(...options.color3);
        portalMaterial.uniforms.color2.value = new THREE.Vector3(...options.color2);
        portalMaterial.uniforms.color1.value = new THREE.Vector3(...options.color1);
        portalMaterial.uniforms.color0.value = new THREE.Vector3(...options.color0);
    }

    // 辉光效果
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, .4, .85);
    bloomPass.threshold = options.bloomThreshold;
    bloomPass.strength = options.bloomStrength;
    bloomPass.radius = options.bloomRadius;
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    // dat.gui
    // const gui = new dat.GUI();
    // const bloom = gui.addFolder('bloom');
    // bloom.add(options, 'bloomStrength', 0.0, 5.0).name('bloomStrength').listen();
    // bloom.add(options, 'bloomRadius', .1, 2.0).name('bloomRadius').listen();
    // bloom.open();
    // const colors = gui.addFolder('Colors');
    // colors.addColor(options, 'color0').name('layer0');
    // colors.addColor(options, 'color1').name('layer1');
    // colors.addColor(options, 'color2').name('layer2');
    // colors.addColor(options, 'color3').name('layer3');
    // colors.addColor(options, 'color4').name('layer4');
    // colors.addColor(options, 'color5').name('layer5');
    // colors.open();
    // gui.hide();

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = async (url, loaded, total) => { };

    // 使用 dracoLoader 加载用blender压缩过的模型
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/public/examples/jsm/libs/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);

    // 模型加载
    let model: { rotation: { x: number; z: number; }; position: { z: number; }; } | null = null;
    loader.load('/public/examples/models/rickAndMorty.glb', (mesh: { scene: THREE.Object3D<THREE.Event>; }) => {
        if (mesh.scene) {
            mesh.scene.scale.set(.02, .02, .02);
            mesh.scene.position.x = -.5;
            mesh.scene.rotation.y = Math.PI;
            mesh.scene.layers.set(0);
            scene.add(mesh.scene);
            model = mesh.scene;
        }
    });

    const clock = new THREE.Clock();
    const tick = (deltaTime?: number) => {

        deltaTime && updateShaderMaterial(deltaTime);

        renderer.clear();
        camera.layers.set(1);
        bloomComposer.render();

        renderer.clearDepth();
        camera.layers.set(0);
        renderer.render(scene, camera);

        const elapsedTime = clock.getElapsedTime()
        const ghost1Angle = elapsedTime * 0.5
        if (model) {
            model.rotation.x = Math.cos(ghost1Angle) * .2
            model.rotation.z = Math.sin(ghost1Angle) * .1
            model.position.z += Math.cos(ghost1Angle) * .005
        }

        const scale = Math.cos(ghost1Angle) * 2 + 3;
        portal && portal.scale.set(scale, scale, scale);

        // 页面重绘时调用自身
        controls && controls.update();
        // TWEEN && TWEEN.update();
        window.requestAnimationFrame(tick);
    }
    tick();
})
</script>
