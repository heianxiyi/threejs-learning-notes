<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import Stage from '@/components/Stage';
import * as THREE from 'three';
import { PerspectiveCamera } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { onMounted, ref } from 'vue';
const container = ref<HTMLElement>()
let plane: GLTF["scene"], camera2: PerspectiveCamera;
onMounted(() => {
    const stage = new Stage(container.value, 5, 0, 5);
    const { scene, renderer, controls } = stage;
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1, -1),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 4)
    ])
    const points = curve.getPoints(100);
    var geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const line = new THREE.Line(geometry, material)
    scene.add(line)

    const tubeGeometry = new THREE.TubeGeometry(curve, 90, .12, 50);
    const tubeMesh = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({
        color: "#00aa00",
        side: THREE.DoubleSide,
        wireframe: true
    }))
    scene.add(tubeMesh)

    const loader = new GLTFLoader()
    loader.load('/temp/stylized_ww1_plane.glb', (gltf) => {
        plane = gltf.scene;
        plane.scale.set(0.05, 0.05, 0.05)
        scene.add(plane)
    })

    camera2 = new THREE.PerspectiveCamera(15, stage.camera.aspect, 0.1, 1000)
    camera2.position.set(0, 0.6, 0)
    camera2.lookAt(new THREE.Vector3(0, 0, 0))
    camera2.rotation.x = 0
    const cameraHelper = new THREE.CameraHelper(camera2);
    scene.add(camera2)
    scene.add(cameraHelper)

    function changeLookAt(t: number) {
        // 当前点在线条上的位置
        const position = curve.getPointAt(t);
        var nPos = new THREE.Vector3(position.x, position.y - 0.03, position.z);
        plane.position.copy(nPos);
        // 返回点t在曲线上位置切线向量
        const tangent = curve.getTangentAt(t);
        // 位置向量和切线向量相加即为所需朝向的点向量
        const lookAtVec = tangent.add(nPos);
        plane.lookAt(lookAtVec);

        if (t > 0.03) {
            var pos = curve.getPointAt(t - 0.03);
            camera2.position.copy(pos);
            camera2.lookAt(tangent)
            stage.camera = camera2
        }
    }

    const loopTime = 10 * 1000; // loopTime: 循环一圈的时间
    stage.beforeRender = (time) => {
        if (curve) {
            let t = (time % loopTime) / loopTime; // 计算当前时间进度百分比
            setTimeout(function () {
                changeLookAt(t);
            }, 500)
        }
    }
    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    container.value?.appendChild(renderer.domElement)
    stage.animate()
})
</script>
    
<style></style>