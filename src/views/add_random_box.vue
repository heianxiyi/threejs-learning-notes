<template>
    <div w="100%" h="100%" ref="container">

    </div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref, onMounted } from 'vue'

const container = ref()

onMounted(() => {
    const scene = new THREE.Scene();
    const width = container.value.offsetWidth || 0;
    const height = container.value.offsetHeight || 0;
    const camera = new THREE.PerspectiveCamera(60, width / height, 10, 3000)
    camera.position.set(-23, 26, 56);
    camera.lookAt(scene.position);


    const planeGeometry = new THREE.PlaneGeometry(60, 40, 10, 10)
    const BasicMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(planeGeometry, BasicMaterial)
    plane.position.set(0, 0, 0)
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)

    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(width, height);
    (container.value as HTMLElement).appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update();
    // controls.addEventListener('change', function () {
    //     // 浏览器控制台查看相机位置变化
    //     console.log('camera.position', camera.position);
    // });

    const ambientLight = new THREE.AmbientLight(0x3c3c3c)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight('white', 1, 150, 120);
    spotLight.position.set(-40, 60, -10)
    scene.add(spotLight)

    const axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)

    let cubeList = []

    // 循环出20个立方体
    for (let i = 0; i < 20; i++) {
        let cubeSize = Math.ceil((Math.random() * 3)) // 随机生成不同大小的立方体尺寸
        let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        let r = Math.floor(Math.random() * 256)
        let g = Math.floor(Math.random() * 256)
        let b = Math.floor(Math.random() * 256)
        let color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
        let cubeMaterial = new THREE.MeshLambertMaterial({
            color // 设置随机颜色
        })

        // 生成立方体
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

        // 根据地面尺寸，随机设置立方体位置
        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width))
        cube.position.y = Math.round((Math.random() * 5))
        cube.position.z = -30 + Math.round((Math.random() * planeGeometry.parameters.height))

        // 将立方体添加到立方体列表中
        cubeList.push(cube)
    }

    // 解构立方体列表，将列表中所有立方体添加到场景中
    scene.add(...cubeList)


    function animate() {
        renderer.render(scene, camera)
        controls.update()
        requestAnimationFrame(animate);
    }

    animate()

    window.onresize = function () {
        const width = container.value.offsetWidth || 0;
        const height = container.value.offsetHeight || 0;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };

})

</script>
    
<style>

</style>