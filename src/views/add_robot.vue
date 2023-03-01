<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import Stage from '@/components/Stage';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref<HTMLElement>()
const gui = ref<GUI>()

onMounted(() => {
    const stage = new Stage(container.value, 0, 8, 18);
    const { scene, renderer } = stage;

    (window as any).camera = stage.camera;

    const grid = new THREE.GridHelper(10)
    scene.add(grid)

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    const dlight = new THREE.DirectionalLight(0xffffff, 1.5)
    dlight.position.set(5, 5, 5);
    scene.add(dlight)

    const AxesHelper = new THREE.AxesHelper(5)
    scene.add(AxesHelper)
    const dz = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), new THREE.MeshPhongMaterial({ color: 0xff3d00, }))
    scene.add(dz)

    function createSphere() {
        return new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), new THREE.MeshPhongMaterial({ color: 0x0a0a0a, }))
    }
    function createBox(h: number) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, h), new THREE.MeshPhongMaterial({ color: 0xff3d00, }))
        box.rotation.x = Math.PI * 0.5
        box.position.x = 0
        box.position.y = h / 2
        return box
    }
    function createGroup(h = 2.5) {
        const Group = new THREE.Group()
        const shpere1 = createSphere()
        Group.add(shpere1)
        const box1 = createBox(h)
        Group.add(box1)
        return Group
    }

    // const GH = new THREE.GridHelper(4)
    // const AxesH = new THREE.AxesHelper(4)

    const g1 = createGroup()
    const g2 = createGroup();
    const g3 = createGroup();
    const g4 = createGroup(1.2);

    g1.add(g2)
    g1.position.y = 0.7
    g1.rotation.z = Math.PI * 0.3

    g2.position.y = 2.5
    g2.rotation.z = Math.PI * -0.5

    g2.add(g3)
    g3.position.y = 2.5
    g3.rotation.z = Math.PI * -0.3

    g3.add(g4)
    g4.position.y = 2.8
    g4.rotation.z = Math.PI * -0.5

    scene.add(g1)

    gui.value = new GUI();
    (gui.value.domElement as any).style = 'position:absolute;'

    gui.value.name = '多段机械臂控制台';

    const f1 = gui.value.addFolder('臂1')
    f1.add(g1.rotation, 'y', -3, 3, 0.1)
    f1.add(g1.rotation, 'z', 0.1, 1.7, 0.1)
    f1.open()

    const f2 = gui.value.addFolder('臂2')
    f2.add(g2.rotation, 'z', -2, 1.8, 0.1)
    f2.add(g2.rotation, 'y', -3, 3, 0.1)
    f2.open()

    const f3 = gui.value.addFolder('臂3')
    f3.add(g3.rotation, 'z', -1.3, 1.7, 0.1)
    f3.add(g3.rotation, 'y', -3, 3, 0.1)
    f3.open()

    const f4 = gui.value.addFolder('臂4')
    f4.add(g4.rotation, 'z', -2, 2, 0.1)
    f4.add(g4.rotation, 'y', -3, 3, 0.1)
    f4.add(g4.rotation, 'x', -3, 3, 0.1)
    f4.open()

    container.value?.append(gui.value.domElement)
    container.value?.append(renderer.domElement)
    stage.animate()
})
</script>
    
<style></style>