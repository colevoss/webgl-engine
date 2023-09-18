import "./style.css";
import * as glm from "gl-matrix";
import * as shaders from "./shaders.webgl";
import { Context } from "./context";
import { Renderer } from "./renderer";
import { Vec4, Vec2, VertexBufferLayout } from "./buffers";
import { Texture2D } from "./texture";
import { OrthographicCamera, PerspectiveCamera } from "./camera";
import { Shader } from "./shader";

const moImgUrl = `mo.png`;

const ctx = new Context();
const renderer = new Renderer(ctx);

import t from "./testshader.glsl?raw";
console.log(t);

// const camera = new PerspectiveCamera(ctx);
const camera = new OrthographicCamera(ctx);

// const v = glm.vec3.fromValues(250, 250, 0);
const v = glm.vec3.fromValues(0, 0, 0);

camera.translate(v);
camera.setRotation(0);

const shader = new Shader(ctx, shaders.vsSource, shaders.fsSource);

shader.bind();

const modelBuffer = ctx.createStaticVertexBuffer();
modelBuffer.bind();
const cellSize = 100;
modelBuffer.setData([
  ...[0, 0, 0, 0], // bottom left
  ...[cellSize, 0, 1, 0], // bottom right
  ...[cellSize, cellSize, 1, 1], // top right
  ...[0, cellSize, 0, 1], // top left
]);
modelBuffer.buffer();

// const modelLayout = new VertexBufferLayout([Vec2("aPosition")]);
// modelBuffer.layout(modelLayout);

// const modelLayout = new VertexBufferLayout();
modelBuffer.layout([Vec2("aPosition"), Vec2("aTexCoord")]);

const dataBuffer = ctx.createStaticVertexBuffer();
dataBuffer.bind();

let data: any[] = [];

const gridSize = 10;
let i = 0;
for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    // const color =
    //   (y + x) % 2 === 0 ? [Math.random(), 0, 0, 1] : [0, 0, Math.random(), 1];
    const color = [Math.random(), Math.random(), Math.random(), 1];
    const xPos = x * (cellSize + 10);
    const yPos = y * (cellSize + 10);
    data = data.concat([...color, xPos, yPos]);
    i++;
  }
}

console.log(i);

dataBuffer.setData(data);

dataBuffer.buffer();

const dataLayout = new VertexBufferLayout([
  Vec4("color").divisor(1),
  Vec2("offset").divisor(1),
]);
dataBuffer.layout(dataLayout);

const indexBuffer = ctx.createIndexBuffer();
indexBuffer.bind();
indexBuffer.setData([
  ...[0, 1, 2], // Triangle 1
  ...[2, 3, 0], // Triangle 2
]);
indexBuffer.buffer();

const vertexArray = ctx.createVertexArray(shader);

vertexArray
  .addVertexBuffer(modelBuffer)
  .addVertexBuffer(dataBuffer)
  .addIndexBuffer(indexBuffer);

const texture = new Texture2D(ctx, moImgUrl);
texture.load();
// texture.load().then(() => texture.bind());
// program.uniform1i("uSampler", 0);

let last = 0;
const dt = () => {
  const t = Date.now();
  const delta = t - last;
  last = t;
  return delta / 1000;
};

const transform = glm.mat4.create();
glm.mat4.translate(transform, transform, glm.vec3.fromValues(0, 0, 0));
glm.mat4.scale(transform, transform, glm.vec3.fromValues(1.5, 1.5, 0));

function draw() {
  // if (last === 0) {
  //   last = Date.now();
  // }
  // const delta = dt();
  // v[0] = delta / 4;

  // shader.uniformMatrix4("uMVP", mvp);

  // console.time("draw");
  renderer.beginScene(camera);
  renderer.clear();

  texture.bind();
  shader.uniform1f("uSampler", 0);
  renderer.submit(shader, vertexArray, transform, i);
  renderer.endScene();
  // console.timeEnd("draw");
  // requestAnimationFrame(draw);
}

export default function main() {
  draw();
}
