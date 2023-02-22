import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Stage {
  scene: THREE.Scene;
  renderer: THREE.WebGL1Renderer;
  domElement: HTMLElement;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  beforeRender: (time: number) => void;
  // 初始化场景
  constructor(dom = document.body, x = 0, y = 0, z = 12) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGL1Renderer({ antialias: true });
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
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.beforeRender = (time) => {
      // console.log(time);
    };
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
  resizeRendererToDisplaySize(renderer: THREE.WebGL1Renderer) {
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
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((time) => {
      this.animate(time);
    });
  }
}
