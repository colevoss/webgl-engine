import * as glm from "gl-matrix";
import { Context } from "../context";
import { Camera } from "./camera";

export class PerspectiveCamera extends Camera {
  private _fov: number = 90;

  constructor(ctx: Context, fov: number = 90) {
    super(ctx);
    this._fov = fov;
  }

  public get fov(): number {
    return this._fov * (Math.PI / 180);
  }

  public setFov(fov: number): this {
    this._fov = fov;
    this.initProjection();
    return this;
  }

  protected override initProjection() {
    const fieldOfView = this.fov;

    const x = this.ctx.windowWidth;
    const y = this.ctx.windowHeight;

    const aspect = x / y;
    const zNear = 0.1;
    const zFar = 100.0;

    return glm.mat4.perspective(
      this.projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar
    );
  }
}
