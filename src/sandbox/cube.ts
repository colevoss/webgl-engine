import "../style.css";
import { mat4, vec3 } from "gl-matrix";
import * as shaders from "./cube.shaders";

import { Context } from "../context";
import { Renderer } from "../renderer";
import { Vec3, Vec4 } from "../buffers";
import { OrthographicCamera, PerspectiveCamera } from "../camera";
import { Shader } from "../shader";

// Scene Setup

const ctx = new Context();
const renderer = new Renderer(ctx);
// const camera = new OrthographicCamera(ctx);
const camera = PerspectiveCamera.init(ctx).setFov(90);

// Model Setup

const cubeShader = new Shader(ctx, shaders.vertex, shaders.fragment);

cubeShader.bind();

// Model buffer
const modelBuffer = ctx.createStaticVertexBuffer();
modelBuffer.bind();
modelBuffer.setData(shaders.positions);
modelBuffer.buffer();
modelBuffer.layout([Vec3("aPosition")]);

// Color buffer
const colorBuffer = ctx.createStaticVertexBuffer();
colorBuffer.bind();
colorBuffer.setData(shaders.colors);
colorBuffer.layout([Vec4("aColor")]);
colorBuffer.buffer();

// Index buffer
const indexBuffer = ctx.createIndexBuffer();
indexBuffer.bind();
indexBuffer.setData(shaders.indices);
indexBuffer.buffer();

const vertexArray = ctx.createVertexArray(cubeShader);
vertexArray
  .addVertexBuffer(modelBuffer)
  .addVertexBuffer(colorBuffer)
  .addIndexBuffer(indexBuffer);

const transform = mat4.create();
// mat4.translate(transform, transform, vec3.fromValues(100, 100, 0));
// mat4.scale(transform, transform, [1, 1, 1]);

const rotateCube = () => {
  mat4.rotate(transform, transform, 0.01, [1, 0, 0]);
};

camera.translate([0, 0, 20]);
// camera.lookAt(transform);

let isClicked = false;

function onClick(event: MouseEvent) {
  isClicked = true;
}

function onUnClick(event: MouseEvent) {
  isClicked = false;
}

function onMove(event: MouseEvent) {
  if (!isClicked) return;
  camera.translate([event.movementX * 0.01, event.movementY * 0.01, 0.0]);
}

ctx.canvas.addEventListener("mousemove", onMove);
ctx.canvas.addEventListener("mousedown", onClick);
ctx.canvas.addEventListener("mouseup", onUnClick);
// function endMouseMoveListener() {
//   ctx.canvas.removeEventListener("mousemove", onMove);
// }

function draw() {
  renderer.beginScene(camera);
  renderer.clear();

  // rotateCube();

  renderer.submit(cubeShader, vertexArray, transform, 1);
  renderer.endScene();

  requestAnimationFrame(draw);
}

export default function main() {
  draw();
}
