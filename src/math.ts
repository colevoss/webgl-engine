import * as mat from "gl-matrix";
import { Context } from "./context";

export function ortho(ctx: Context) {
  const x = ctx.windowWidth / ctx.scaleFactor;
  const y = ctx.windowHeight / ctx.scaleFactor;

  const matrix = mat.mat4.create();

  mat.mat4.ortho(
    matrix,
    0, // left
    x, // right
    0,
    y, // top
    -1, // near
    1 // far
  );

  return matrix;
}

export function translate() {
  const i = mat.mat4.create();
  const v = mat.vec3.fromValues(100, 0, 0);
  return mat.mat4.translate(i, i, v);
}

export function multiply(m: mat.mat4, ...mul: mat.mat4[]) {
  for (const matrix of mul) {
    mat.mat4.multiply(m, m, matrix);
  }

  return m;
}
