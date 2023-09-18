import * as glm from "gl-matrix";
import { Camera } from "./camera";

export class OrthographicCamera extends Camera {
  public left = -1;
  public right = 1;

  public bottom = -1;
  public top = 1;

  protected override initProjection() {
    // const x = this.ctx.windowWidth;
    // const y = this.ctx.windowHeight;

    glm.mat4.ortho(
      this.projectionMatrix, // matrix
      this.left,
      this.right,
      this.bottom,
      this.top,
      -1, // near
      1 // far
    );
  }
}
