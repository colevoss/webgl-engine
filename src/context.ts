import { IndexBuffer, StaticVertexBuffer, VertexArray } from "./buffers";
import { Shader } from "./shader";

export class Context {
  public canvas: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;
  public scaleFactor: number = 1;

  public windowWidth: number = 0;
  public windowHeight: number = 0;

  public canvasWidth: number = 0;
  public canvasHeight: number = 0;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#glcanvas");
    if (!canvas) {
      throw new Error("no canvas");
    }

    this.canvas = canvas;
    this.scale();

    const gl = canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("Coudl not get webgl context");
    }

    this.scaleFactor = window.devicePixelRatio;

    this.gl = gl;

    // @ts-ignore
    window.gl = gl;
  }

  public scale() {
    this.windowWidth = document.body.clientWidth;
    this.windowHeight = document.body.clientHeight;

    this.canvasWidth = this.windowWidth * this.scaleFactor;
    this.canvasHeight = this.windowHeight * this.scaleFactor;

    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.canvas.style.width = `${this.windowWidth}px`;
    this.canvas.style.height = `${this.windowHeight}px`;
  }

  public createStaticVertexBuffer(): StaticVertexBuffer {
    return new StaticVertexBuffer(this);
  }

  public createIndexBuffer(): IndexBuffer {
    return new IndexBuffer(this);
  }

  public createVertexArray(shader: Shader): VertexArray {
    return new VertexArray(this, shader);
  }
}
