<template>
    <div w="100%" h="100%" ref="container"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { onMounted, Ref, ref } from 'vue';

const container = ref() as Ref<HTMLElement>;
onMounted(() => {
    const { clientWidth, clientHeight } = container.value;
    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0xffffff, 0)
    container.value.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000);
    camera.position.set(-380, 200, 0)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)

    const amblight = new THREE.AmbientLight(0x999999);
    scene.add(amblight)

    const sunLight = new THREE.PointLight(0xddddaa, 1.5, 500);
    scene.add(sunLight)

    const starsParams = [
        {
            name: 'Sun',
            speed: 0,
            angle: 0,
            color: 0xdd4422,
            distance: 0,
            volume: 12,
        },
        {
            name: 'Mercury',
            speed: 0.02,
            angle: 0,
            color: 0x7C4825,
            distance: 30,
            volume: 2,
        },
        {
            name: 'Venus',
            speed: 0.012,
            angle: 0.5,
            color: 0xC14B14,
            distance: 45,
            volume: 2.5,
        },
        {
            name: 'Earth',
            speed: 0.01,
            angle: 0.3,
            color: 0x006D92,
            distance: 65,
            volume: 3,
        },
        {
            name: 'Mars',
            speed: 0.008,
            angle: 0.7,
            color: 0xA2170C,
            distance: 85,
            volume: 2.5,
        },
        {
            name: 'Jupiter',
            speed: 0.006,
            angle: 1.2,
            color: 0xDA9D5C,
            distance: 125,
            volume: 8,
        },
        {
            name: 'Saturn',
            speed: 0.005,
            angle: 1.4,
            color: 0xAD864D,
            distance: 155,
            volume: 6,
        },
        {
            name: 'Uranus',
            speed: 0.003,
            angle: 0.5,
            color: 0x1AB3B5,
            distance: 185,
            volume: 4,
        },
        {
            name: 'Neptune',
            speed: 0.002,
            angle: 0.4,
            color: 0x0051AB,
            distance: 215,
            volume: 4,
        },
    ]
    const stars: any[] = [];
    function createStar(name: string, speed: number, angle: number, color: number, distance: number, volume: number) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(volume, 36, 16),
            new THREE.MeshLambertMaterial({ color, })
        )
        const track = new THREE.Mesh(
            new THREE.RingGeometry(distance - 0.2, distance + 0.2, 128, 1),
            new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide })
        )
        track.rotation.x = Math.PI * 0.5;
        scene.add(track)

        mesh.position.z = -distance;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.name = name;
        // mesh.visible = false;
        scene.add(mesh);
        stars.push({
            name,
            speed,
            angle,
            distance,
            volume,
            Mesh: mesh
        })
    }
    function moveStar(star: any) {
        star.angle += star.speed;
        if (star.angle > Math.PI * 2) {
            star.angle -= Math.PI * 2;
        }
        star.Mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));
    }
    function createParticles() {
        /*背景星星*/
        const particles = 20000;  //星星数量
        /*buffer做星星*/
        const bufferGeometry = new THREE.BufferGeometry();

        /*32位浮点整形数组*/
        let positions = new Float32Array(particles * 3);
        let colors = new Float32Array(particles * 3);

        let color = new THREE.Color();

        const gap = 500; // 定义星星的最近出现位置
        for (let i = 0; i < positions.length; i += 3) {
            // positions
            /*-2gap < x < 2gap */
            let x = (Math.random() * gap * 2) * (Math.random() < .5 ? -1 : 1);
            let y = (Math.random() * gap * 2) * (Math.random() < .5 ? -1 : 1);
            let z = (Math.random() * gap * 2) * (Math.random() < .5 ? -1 : 1);

            /*找出x,y,z中绝对值最大的一个数*/
            let biggest: 'x' | 'y' | 'z' = Math.abs(x) > Math.abs(y) ? Math.abs(x) > Math.abs(z) ? 'x' : 'z' :
                Math.abs(y) > Math.abs(z) ? 'y' : 'z';

            let pos: { x: number, y: number, z: number } = { x, y, z };

            /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
            if (Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap;

            x = pos['x'];
            y = pos['y'];
            z = pos['z'];

            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;

            // colors/
            /*70%星星有颜色*/
            let hasColor = Math.random() > 0.3;
            let vx, vy, vz;

            if (hasColor) {
                vx = (Math.random() + 1) / 2;
                vy = (Math.random() + 1) / 2;
                vz = (Math.random() + 1) / 2;
            } else {
                vx = 1;
                vy = 1;
                vz = 1;
            }

            color.setRGB(vx, vy, vz);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        bufferGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        bufferGeometry.computeBoundingSphere();

        /*星星的material*/
        let material = new THREE.PointsMaterial({ size: 3, vertexColors: true });
        const particleSystem = new THREE.Points(bufferGeometry, material);
        scene.add(particleSystem);
    }
    createParticles()
    starsParams.forEach(item => {
        createStar(item.name, item.speed, item.angle, item.color, item.distance, item.volume);
    })
    let opSun = new THREE.Mesh(new THREE.SphereGeometry(14, 36, 16),
        new THREE.MeshLambertMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: .35
        })
    );
    opSun.name = 'Sun';
    scene.add(opSun);

    const raycaster = new THREE.Raycaster();  //指向镭射
    const mouse = new THREE.Vector2();  //鼠标屏幕向量
    const starNames: any = {};
    let displayName: any;
    const displayStarsName = () => {
        stars.forEach(star =>
            nameConstructor(star.name, star.volume)
        )
        function nameConstructor(name: string, volume: number) {
            const fontLoader = new FontLoader();
            fontLoader.load('/examples/fonts/gentilis_bold.typeface.json', (font) => {
                let planetName = new THREE.Mesh(
                    new TextGeometry(name, {
                        font,
                        size: 4,
                        height: 4
                    }),
                    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
                );
                planetName.visible = false;
                starNames[name] = {
                    ...planetName,
                    volume
                };
                // planetName.
                scene.add(planetName);
            })
        }
    }
    displayStarsName()
    window.addEventListener('mousemove', (event: MouseEvent) => {
        if (!container.value) return
        let getBoundingClientRect = container.value.getBoundingClientRect()
        mouse.x = ((event.clientX - getBoundingClientRect.left) / clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - getBoundingClientRect.top) / clientHeight) * 2 + 1;

    }, false)
    /*鼠标指向行星显示名字*/

    const animate = () => {
        controls.update();
        stars.forEach(item => {
            moveStar(item)
        })
        /*交汇点对像*/
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            /*取第一个交汇对像（最接近相机）*/
            let obj = intersects[0].object;

            let name = obj.name;
            /*把上一个显示隐藏*/
            // displayName && (displayName.visible = false);

            /*如果是有设定名字的东西*/
            if (starNames[name]) {
                displayName = starNames[name];
                displayName.visible = true;
                /*复制行星位置*/
                displayName.position.copy(obj.position);
                /*文字居中*/
                displayName.geometry.center();
                /*显示在行星的上方（y轴）*/
                displayName.position.y = starNames[name].volume + 4;
                /*面向相机*/
                // displayName.lookAt(camera.position);
            }
        } else {
            // displayName && displayName.visible && (displayName.visible = false)
        }
        renderer.render(scene, camera);
        renderer.setAnimationLoop(animate)
    }
    animate()
})
</script>
    
<style></style>