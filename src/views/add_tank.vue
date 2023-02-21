<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import Stage from '@/components/Stage'
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement>()
onMounted(() => {
    if (!container.value) return

    const { clientWidth, clientHeight } = container.value
    const stage = new Stage(container.value);
    const { scene, renderer } = stage;
    renderer.setClearColor(0xaaaaaa);
    renderer.shadowMap.enabled = true;

    const AxesHelper = new THREE.AxesHelper(5)
    scene.add(AxesHelper)

    function makeCamera(fov = 60) {
        const aspect = clientWidth / clientHeight;
        const zNear = 0.1;
        const zFar = 1000;
        return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar)
    }

    // 重新初始化相机
    const camera = makeCamera()
    camera.position.set(16, 8, 20)
    camera.lookAt(0, 0, 0)
    stage.camera = camera
    stage.controls = new OrbitControls(camera, renderer.domElement)


    // 平行光1
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 20, 0)
    scene.add(light)
    light.castShadow = true
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048

    const d = 50
    light.shadow.camera.left = -d
    light.shadow.camera.right = d
    light.shadow.camera.top = d
    light.shadow.camera.bottom = -d
    light.shadow.camera.near = 1
    light.shadow.camera.far = 50

    // 平行光2
    const light2 = new THREE.DirectionalLight(0xffffff, 1)
    light2.position.set(1, 2, 4)
    scene.add(light2)

    const groundGeometry = new THREE.PlaneGeometry(50, 50)
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 })
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.rotation.x = Math.PI * -0.5
    groundMesh.receiveShadow = true
    scene.add(groundMesh)

    // 坦克
    const tank = new THREE.Group()
    scene.add(tank)
    // 坦克相机
    const carRadius = 1
    const bodyCenterY = (carRadius * 3) / 2
    const tankCameraFov = 75
    const tankCamera = makeCamera(tankCameraFov)
    tankCamera.position.y = 5
    tankCamera.position.z = -10
    tankCamera.lookAt(0, bodyCenterY, 0)
    tank.add(tankCamera)

    const bodyGeometry = new THREE.SphereGeometry(carRadius)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa })
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
    bodyMesh.position.y = bodyCenterY
    bodyMesh.castShadow = true
    const box = new THREE.BoxHelper(bodyMesh)
    tank.add(box)
    tank.add(bodyMesh)

    const wheelRadius = 0.6
    const wheelThickness = 0.5
    const wheelSegments = 12
    const wheelGeometry = new THREE.CylinderGeometry(
        wheelRadius,
        wheelRadius,
        wheelThickness,
        wheelSegments
    )
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
    const cx = carRadius + wheelThickness / 2 - 0.2
    const wheelMeshes = [-cx, cx].map((x) => {
        const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
        mesh.rotation.z = Math.PI * 0.5
        mesh.position.set(x, wheelRadius, 0)
        mesh.castShadow = true
        tank.add(mesh)
        return mesh
    })

    // 炮筒
    const barrel = new THREE.Group()
    barrel.position.y = bodyCenterY + 0.3
    tank.add(barrel)
    // 炮筒模型
    const barrelSize = 0.3
    const barrelLength = 5
    const barrelGeometry = new THREE.BoxGeometry(barrelSize, barrelSize, barrelLength)
    const barrelMesh = new THREE.Mesh(barrelGeometry, bodyMaterial)
    barrelMesh.position.z = barrelLength / 2
    barrelMesh.castShadow = true
    barrel.add(barrelMesh)
    // 炮管相机
    const barrelCamera = makeCamera()
    barrelCamera.position.y = 1.4
    barrel.add(barrelCamera)

    // 目标-负责目标的整体高度
    const target = new THREE.Group()
    target.position.z = 2
    target.position.y = 4
    scene.add(target)
    // 浮动节点-负责目标的上下浮动
    const targetBob = new THREE.Group()
    target.add(targetBob)
    // 目标模型
    const targetGeometry = new THREE.SphereGeometry(0.5, 6, 3)
    const targetMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        flatShading: true,
    })
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial)
    targetMesh.castShadow = true
    targetBob.add(targetMesh)
    // 目标相机
    const targetCamera = makeCamera()
    targetCamera.position.y = 1
    targetCamera.position.z = -2
    targetCamera.rotation.y = Math.PI
    // 目标相机旋转轴-带动目标相机的旋转
    const targetCameraPivot = new THREE.Group()
    targetBob.add(targetCameraPivot)
    targetCameraPivot.add(targetCamera)

    // 建立一条路径，之后会让坦克沿此路径移动
    const curve = new THREE.SplineCurve([
        new THREE.Vector2(-6, 5),
        new THREE.Vector2(-6, -4),
        new THREE.Vector2(8, 0),
        new THREE.Vector2(-6, 12),
        new THREE.Vector2(-6, 5)
    ])
    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const splineObject = new THREE.Line(geometry, material)
    splineObject.rotation.x = Math.PI * 0.5
    splineObject.position.y = 0.05
    scene.add(splineObject)

    // 坦克位置
    const tankPosition = new THREE.Vector2()
    // 坦克朝向
    const tankTarget = new THREE.Vector2()
    // 目标位
    const targetPosition = new THREE.Vector3()
    // 用dat.gui切换相机
    const gui = new GUI({ autoPlace: false })
    gui.domElement.style = 'position:absolute;'
    // gui.domElement
    const cameras = new Map([
        ['camera', camera],
        ['barrelCamera', barrelCamera],
        ['targetCamera', targetCamera],
        ['tankCamera', tankCamera]
    ])

    const curCamera = { name: 'camera' }
    gui.add(curCamera, 'name', [...cameras.keys()]).onChange((key) => {
        const {
            domElement: { clientWidth, clientHeight }
        } = renderer
        const cam = cameras.get(key)
        if (cam) {
            stage.camera = cam
            stage.camera.aspect = clientWidth / clientHeight
            stage.camera.updateProjectionMatrix()
        }
    })

    // 渲染之前
    stage.beforeRender = (time = 0) => {
        time *= 0.001

        // 坦克移动插值
        const tankTime = time * 0.1
        // 坦克位置
        curve.getPointAt(tankTime % 1, tankPosition)
        // 坦克朝向
        curve.getPointAt((tankTime + 0.01) % 1, tankTarget)
        // 设置坦克位置
        tank.position.set(tankPosition.x, 0, tankPosition.y)
        // 设置坦克朝向
        tank.lookAt(tankTarget.x, 0, tankTarget.y)

        // 车轱辘的滚动
        wheelMeshes.forEach((obj) => {
            obj.rotation.x = time * 3
        })

        // 目标对象的上下浮动
        targetBob.position.y = Math.sin(time * 2) * 2

        // 获取目标点的世界位
        targetMesh.getWorldPosition(targetPosition)
        // 炮筒指向目标点
        barrel.lookAt(targetPosition)

        if (curCamera.name === 'barrelCamera') {
            // 炮筒相机看向目标点
            barrelCamera.lookAt(targetPosition)
        } else if (curCamera.name === 'targetCamera') {
            // 目标相机看向坦克
            tank.getWorldPosition(targetPosition)
            targetCameraPivot.lookAt(targetPosition)
        }
    }
    container.value.appendChild(gui.domElement)
    container.value.appendChild(renderer.domElement)
    stage.animate()
})
</script>