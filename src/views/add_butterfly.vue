<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { IUniform, Side } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, Ref, ref, unref } from 'vue';
import fragment from './butterfly/fragment';
import vertex from './butterfly/vertex';

const container = ref() as Ref<HTMLElement>;
const SIZE = 280;
const CAMERA_SIZE_X = 640;
const CAMERA_SIZE_Y = 480;
const BUTTERFLY_NUM = 7;

class Butterfly {
    uniforms: { [uniform: string]: IUniform };
    obj: THREE.Mesh;
    constructor(i: any, texture: THREE.Texture) {
        this.uniforms = {
            index: {
                value: i
            },
            time: {
                value: 0
            },
            size: {
                value: SIZE
            },
            texture: {
                value: texture
            }
        };
        this.obj = this.createObj();
    }
    createObj() {
        const geometry = new THREE.PlaneGeometry(SIZE, SIZE / 2, 24, 12);
        const mesh = new THREE.Mesh(
            geometry,
            new THREE.RawShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: vertex,
                fragmentShader: fragment,
                depthWrite: false,
                side: THREE.DoubleSide,
                transparent: true
            })
        )
        mesh.rotation.x = -45 * Math.PI / 180;
        return mesh
    }
    render(time: number) {
        this.uniforms.time.value += time;
        this.obj.position.z = (this.obj.position.z > -900) ? this.obj.position.z - 4 : 900;
    }
}

onMounted(() => {
    const canvas = unref(container);
    const { clientWidth, clientHeight } = canvas;
    const renderer = new THREE.WebGL1Renderer({ antialias: false });
    renderer.setSize(clientWidth, clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    canvas.appendChild(renderer.domElement)

    const scene = new THREE.Scene();
    const k = clientWidth / clientHeight;
    const camera = new THREE.OrthographicCamera(-SIZE * k, SIZE * k, SIZE, -SIZE, 1, 10000);
    const clock = new THREE.Clock();
    const loader = new THREE.TextureLoader();

    const butterflies: Butterfly[] = [];

    const checkSize = () => {
        const { clientWidth, clientHeight } = renderer.domElement;
        const { clientWidth: width, clientHeight: height } = container.value;
        const needResize = clientWidth !== width || clientHeight !== height;
        if (needResize) {
            renderer.setSize(width, height);
            const k = width / height;
            camera.left = k * -SIZE;
            camera.right = k * SIZE;
            camera.top = SIZE;
            camera.bottom = -SIZE;
            camera.updateProjectionMatrix();
        }
    }

    renderer.setClearColor(0xeeeeee, 1);
    camera.position.set(250, 500, 1000);
    camera.lookAt(0, 0, 0);

    loader.load('/temp/tex.png', (texture) => {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        for (let i = 0; i < BUTTERFLY_NUM; i++) {
            butterflies[i] = new Butterfly(i, texture);
            butterflies[i].obj.position.set(
                ((i + 1) % 3 - 1) * i * 50,
                0,
                1800 / BUTTERFLY_NUM * i
            )
            scene.add(butterflies[i].obj)
        }
    })
    renderer.render(scene, camera);

    const animate = () => {
        checkSize();
        const time = clock.getDelta();
        for (let i = 0; i < butterflies.length; i++) {
            butterflies[i].render(time);
        }
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate)
})

</script>
    
<style></style>