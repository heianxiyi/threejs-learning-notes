<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const container = ref<HTMLElement>()

onMounted(() => {
    const w = container.value?.offsetWidth || 0;
    const h = container.value?.offsetHeight || 0;

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xffffff, 10, 1500)

    const camera = new THREE.PerspectiveCamera(75, w / h, 1, 1000)
    camera.lookAt(scene.position)
    camera.position.set(97, 40, 24)
    // camera.position.set(26, 27, 40)

    window = {
        ...window,
        camera: camera
    } as any

    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(w, h);
    renderer.setClearColor('#a8b8d2', 1)
    container.value?.appendChild(renderer.domElement)

    const light = new THREE.AmbientLight(0xCCCCCC)
    scene.add(light);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper)

    // const controls = new OrbitControls(camera, renderer.domElement);

    const house = new THREE.Group();

    function createGrassland() {
        const texture = new THREE.TextureLoader().load('/public/examples/textures/house/grassland.png');
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(100, 100)

        const geometry = new THREE.PlaneGeometry(10000, 10000);
        const meshBasicMaterial = new THREE.MeshBasicMaterial({ map: texture })
        const grass = new THREE.Mesh(geometry, meshBasicMaterial);
        grass.rotation.x = -0.5 * Math.PI;
        scene.add(grass)
    }

    function createFloor() {
        const geometry = new THREE.PlaneGeometry(60, 90);
        const texture = new THREE.TextureLoader().load('/public/examples/textures/house/floor.png');
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(4, 12)

        const meshBasicMaterial = new THREE.MeshBasicMaterial({ map: texture })
        const floor = new THREE.Mesh(geometry, meshBasicMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.position.y = 0.1;
        scene.add(floor)
    }

    function createSideWall() {
        const shape = new THREE.Shape();
        shape.moveTo(-30, 0);
        shape.lineTo(30, 0);
        shape.lineTo(30, 35);
        shape.lineTo(0, 50);
        shape.lineTo(-30, 35);
        shape.lineTo(-30, 0);

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape);

        const texture = new THREE.TextureLoader().load('/public/examples/textures/house/wall.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.03, 0.02);

        var material = new THREE.MeshBasicMaterial({ map: texture });

        const sideWall = new THREE.Mesh(extrudeGeometry, material);

        house.add(sideWall);

        return sideWall;
    }

    function createBackWall() {
        const shape = new THREE.Shape();
        shape.moveTo(-45, 0);
        shape.lineTo(45, 0);
        shape.lineTo(45, 35);
        shape.lineTo(-45, 35);
        shape.lineTo(-45, 0);

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape);

        const texture = new THREE.TextureLoader().load('/public/examples/textures/house/wall.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.03, 0.02);

        var material = new THREE.MeshBasicMaterial({ map: texture });

        const BackWall = new THREE.Mesh(extrudeGeometry, material);
        BackWall.rotation.y = -0.5 * Math.PI;
        BackWall.position.x = -30;
        house.add(BackWall);
    }

    function createFontWall() {
        const shape = new THREE.Shape();
        shape.moveTo(-45, 0);
        shape.lineTo(45, 0);
        shape.lineTo(45, 35);
        shape.lineTo(-45, 35);
        shape.lineTo(-45, 0);

        const window = new THREE.Path();
        window.moveTo(-25, 15)
        window.lineTo(-10, 15)
        window.lineTo(-10, 30)
        window.lineTo(-25, 30)
        window.lineTo(-25, 15)
        shape.holes.push(window);

        const door = new THREE.Path();
        door.moveTo(10, 0)
        door.lineTo(10, 30)
        door.lineTo(30, 30)
        door.lineTo(30, 0)
        door.lineTo(10, 0)
        shape.holes.push(door)

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape);

        const texture = new THREE.TextureLoader().load('/public/examples/textures/house/wall.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.03, 0.02);

        var material = new THREE.MeshBasicMaterial({ map: texture });

        const FontWall = new THREE.Mesh(extrudeGeometry, material);
        FontWall.rotation.y = -0.5 * Math.PI;
        FontWall.position.x = 30;
        house.add(FontWall);
    }

    function createWindow() {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(15, 0)
        shape.lineTo(15, 15)
        shape.lineTo(0, 15)
        shape.lineTo(0, 0)

        const holes = new THREE.Path()
        holes.moveTo(1, 1)
        holes.lineTo(14, 1)
        holes.lineTo(14, 14)
        holes.lineTo(1, 14)
        holes.lineTo(1, 1)
        shape.holes.push(holes)

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape);

        var material = new THREE.MeshBasicMaterial({ color: '#a4a4a4' });

        const geometry = new THREE.Mesh(extrudeGeometry, material);
        geometry.rotation.y = 0.5 * Math.PI;
        geometry.position.x = 30;
        geometry.position.z = -10;
        geometry.position.y = 15;
        house.add(geometry);
    }

    function createDoor() {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(20, 0)
        shape.lineTo(20, 30)
        shape.lineTo(0, 30)
        shape.lineTo(0, 0)

        const holes = new THREE.Path()
        holes.moveTo(1, 1)
        holes.lineTo(19, 1)
        holes.lineTo(19, 29)
        holes.lineTo(1, 29)
        holes.lineTo(1, 1)
        shape.holes.push(holes)

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape);

        var material = new THREE.MeshBasicMaterial({ color: '#a4a4a4' });

        const geometry = new THREE.Mesh(extrudeGeometry, material);
        geometry.rotation.y = 0.5 * Math.PI;
        geometry.position.x = 30;
        geometry.position.z = 30;
        house.add(geometry);
    }

    function creatRoof() {
        const geometry = new THREE.BoxGeometry(37, 92, 2)

        const colorMaterial = new THREE.MeshBasicMaterial({ color: 'grey' })
        const texture = new THREE.TextureLoader().load('/public/examples/textures/house/tile.png')
        texture.rotation = Math.PI * 0.5
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(11, 1.5)
        const titlMaterial = new THREE.MeshBasicMaterial({ map: texture })
        const material = [colorMaterial, colorMaterial, colorMaterial, colorMaterial, colorMaterial, titlMaterial]

        const roof = new THREE.Mesh(geometry, material);

        roof.rotation.x = Math.PI / 2
        roof.rotation.y = - Math.PI / 4 * 0.6
        roof.position.z = 0.9
        roof.position.x = 16
        roof.position.y = 43
        house.add(roof)

        return roof
    }

    function createHouse() {
        createFloor()
        const wallSide1 = createSideWall()
        const wallSide2 = createSideWall()
        wallSide1.position.z = 45
        wallSide2.position.z = -45

        createBackWall()
        createFontWall()
        createWindow()
        createDoor()
        creatRoof()
        const roof2 = creatRoof()
        roof2.rotation.x = Math.PI / 2;
        roof2.rotation.y = Math.PI / 4 * 0.6;
        roof2.position.y = 43;
        roof2.position.x = -16;

        scene.add(house)
    }

    function createBed() {
        const loader = new GLTFLoader()
        loader.load("/public/examples/textures/house/bed.glb", (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -25);
            // 设置模型缩放
            model.scale.set(18, 18, 18);
            scene.add(model);
        })
    }

    createGrassland()
    createHouse()
    createBed()
    // const clock = new THREE.Clock();

    // const controls = new FirstPersonControls(camera, renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    // controls.lookSpeed = 0.05;
    // controls.movementSpeed = 100;
    // controls.lookVertical = false;

    function render() {
        // const delta = clock.getDelta();
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render)
    }
    render()
})
</script>
    
<style>

</style>