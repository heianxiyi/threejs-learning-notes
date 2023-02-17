<template>
  <div bg="#bfe3dd" w="100%" h="100%" ref="box"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
// 引入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 引入模型加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 引入模型解压器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 引入房间环境/场景 （类似于房间环境）
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
// 引入性能监视器
import Stats from "three/examples/jsm/libs/stats.module";

const mixer = ref();
const box = ref<HTMLElement>();
onMounted(() => {
  // 获取dom容器的宽高
  const boxWidth = box.value?.offsetWidth || 0;
  const boxHeight = box.value?.offsetHeight || 0;
  // 创建clock对象，用于跟踪时间
  const clock = new THREE.Clock();
  // 获取dom容器
  const container = box.value;

  // 创建性能监视器
  const stats = Stats();
  // 修改性能监视器的定位
  stats.dom.style.position = "absolute";
  // 将性能监视器添加到dom容器
  container?.appendChild(stats.dom);

  // 创建渲染器
  const renderer = new THREE.WebGL1Renderer({
    antialias: true, // 设置防锯齿
  });
  // 设置渲染器像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
  // 设置渲染器宽高尺寸
  renderer.setSize(boxWidth, boxHeight);
  // 设置渲染器的输出格式
  renderer.outputEncoding = THREE.sRGBEncoding;
  // 将渲染内容添加到容器内
  container?.appendChild(renderer.domElement);

  // 创建一个PMREMGenerator，从立方体映射环境纹理生成预过滤的 Mipmap 辐射环境贴图
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  // 创建一个场景
  const scene = new THREE.Scene();
  // 设置场景背景颜色为0xbfe3dd
  scene.background = new THREE.Color(0xbfe3dd);
  // 设置场景的纹理，从提供的场景中生成纹理
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;

  // 创建一个透视相机
  const camera = new THREE.PerspectiveCamera(40, boxWidth / boxHeight, 1, 100);
  // 设置相机位置
  camera.position.set(5, 2, 8);

  // 创建轨道控制器，可以使相机围绕目标进行轨道运动
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器的焦点
  controls.target.set(0, 0.5, 0);
  controls.update();
  // 禁用摄像机平移
  controls.enablePan = false;
  // 开启控制器阻尼
  controls.enableDamping = true;

  // 创建解压器，并设置路径，另外gltf后面一定要加斜杠
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/examples/jsm/libs/draco/gltf/");

  // 创建模型加载器
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "/examples/models/gltf/LittlestTokyo.glb",
    function (gltf) {
      const model = gltf.scene;
      // 设置模型配置
      model.position.set(1, 1, 0);
      // 设置模型缩放
      model.scale.set(0.01, 0.01, 0.01);
      // 将模型添加到创建
      scene.add(model);

      // 创建一个动画混合器，动画混合器是用于场景中特定对象的动画的播放器。
      // 当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。
      mixer.value = new THREE.AnimationMixer(model);
      // 播放模型的动画
      mixer.value.clipAction(gltf.animations[0]).play();

      animate();
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  window.onresize = function () {
    const boxWidth = box.value?.offsetWidth || 0;
    const boxHeight = box.value?.offsetHeight || 0;

    camera.aspect = boxWidth / boxHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(boxWidth, boxHeight);
  };

  const animate = () => {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    mixer.value.update(delta);

    controls.update();

    stats.update();

    renderer.render(scene, camera);
  };
});
</script>
