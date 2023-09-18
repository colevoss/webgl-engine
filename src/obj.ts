import * as glm from "gl-matrix";
import * as math from "./math";
import { Context } from "./context";

class Obj {
  public t: glm.mat4;
  public ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.t = glm.mat4.create();
  }

  public translate(vec: glm.vec3) {}
}
