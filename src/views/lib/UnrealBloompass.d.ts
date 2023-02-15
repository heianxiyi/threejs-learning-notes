declare module "*/UnrealBloompass.min.js" {
  type Color = import("three").Color;
  type MeshBasicMaterial = import("three").MeshBasicMaterial;
  type ShaderMaterial = import("three").ShaderMaterial;
  type Vector2 = import("three").Vector2;
  type Vector3 = import("three").Vector3;
  type WebGLRenderTarget = import("three").WebGLRenderTarget;
  type WebGLRenderer = import("three").WebGLRenderer;

  type FullScreenQuad =
    import("three/examples/jsm/postprocessing/Pass").FullScreenQuad;

  class Pass {
    constructor();
    enabled: boolean;
    needsSwap: boolean;
    clear: boolean;
    renderToScreen: boolean;

    setSize(width: number, height: number): void;
    render(
      renderer: WebGLRenderer,
      writeBuffer: WebGLRenderTarget,
      readBuffer: WebGLRenderTarget,
      deltaTime: number,
      maskActive: boolean
    ): void;

    dispose(): void;
  }

  class UnrealBloomPass extends Pass {
    constructor(
      resolution: Vector2,
      strength: number,
      radius: number,
      threshold: number
    );
    resolution: Vector2;
    strength: number;
    radius: number;
    threshold: number;
    clearColor: Color;
    renderTargetsHorizontal: WebGLRenderTarget[];
    renderTargetsVertical: WebGLRenderTarget[];
    nMips: number;
    renderTargetBright: WebGLRenderTarget;
    highPassUniforms: object;
    materialHighPassFilter: ShaderMaterial;
    separableBlurMaterials: ShaderMaterial[];
    compositeMaterial: ShaderMaterial;
    bloomTintColors: Vector3[];
    copyUniforms: object;
    materialCopy: ShaderMaterial;
    oldClearColor: Color;
    oldClearAlpha: number;
    basic: MeshBasicMaterial;
    fsQuad: FullScreenQuad;

    dispose(): void;
    getSeperableBlurMaterial(): ShaderMaterial;
    getCompositeMaterial(): ShaderMaterial;
  }
  export { UnrealBloomPass };
}
