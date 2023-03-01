import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class Stage {
  scene: THREE.Scene;
  renderer: THREE.WebGL1Renderer | THREE.WebGLRenderer;
  domElement: HTMLElement;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  stats: Stats | undefined;
  beforeRender: (time: number) => void;
  // 初始化场景
  constructor(dom = document.body, x = 0, y = 4, z = 12, render = 2) {
    this.scene = new THREE.Scene();
    this.renderer =
      render === 2
        ? new THREE.WebGL1Renderer({ antialias: true })
        : new THREE.WebGLRenderer({ antialias: true });
    this.domElement = dom;
    const { clientWidth, clientHeight } = this.domElement;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setSize(clientWidth, clientHeight, false);

    this.camera = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    (window as any).camera = this.camera;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1200;
    this.controls.enablePan = true;
    this.beforeRender = (time) => {
      // console.log(time);
    };
  }
  // 添加初始灯光
  addLight() {
    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
    const sportLight = new THREE.SpotLight(0xffffff); //添加上方光源
    sportLight.position.set(0, 5, 0); //光源位置
    this.scene.add(sportLight);
    this.scene.add(new THREE.PointLightHelper(sportLight, 1));
  }
  // 添加帮助视图
  viewHelp(h = 10) {
    const axes = new THREE.AxesHelper(h / 2);
    this.scene.add(axes);
    const grid = new THREE.GridHelper(h, h * 2);
    this.scene.add(grid);
    return {
      axes,
      grid,
    };
  }
  // 添加性能监视器
  addStats() {
    this.stats = Stats();
    (this.stats.domElement as any).style = "position:absolute;left: 0;top: 0;";
    this.domElement.appendChild(this.stats.domElement);
  }
  // 响应式布局
  responsive() {
    const { renderer, camera } = this;
    if (this.resizeRendererToDisplaySize(renderer)) {
      const { clientWidth, clientHeight } = this.domElement;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
  }
  // 重置渲染尺寸
  resizeRendererToDisplaySize(
    renderer: THREE.WebGL1Renderer | THREE.WebGLRenderer
  ) {
    const { clientWidth, clientHeight } = renderer.domElement;
    const { clientWidth: width, clientHeight: height } = this.domElement;
    const [w, h] = [width, height];
    const needResize = clientWidth !== w || clientHeight !== h;
    if (needResize) {
      renderer.setSize(w, h, false);
    }
    return needResize;
  }
  animate(time = 0) {
    this.responsive();
    this.beforeRender(time);
    this.controls.update();
    this.stats && this.stats.update();
    this.renderer.render(this.scene, this.camera);
    this.renderer.setAnimationLoop((time) => {
      this.animate(time);
    });
  }
}
