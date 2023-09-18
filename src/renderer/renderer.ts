import * as glm from "gl-matrix";
import { IndexBuffer, VertexArray } from "../buffers";
import { Context } from "../context";
import { Shader } from "../shader";
import { Camera } from "../camera";
import { Transform, WebGL } from "../core";

export class Renderer {
  public ctx: Context;
  private clearColor: glm.vec4 = glm.vec4.fromValues(0, 0, 0, 1);

  public camera!: Camera;

  constructor(ctx: Context) {
    this.ctx = ctx;

    this.ctx.gl.enable(WebGL.DEPTH_TEST);
    // this.ctx.gl.depthFunc(WebGL.LESS);
    this.ctx.gl.depthFunc(WebGL.LEQUAL);
    this.ctx.gl.enable(WebGL.CULL_FACE);
    this.ctx.gl.cullFace(WebGL.BACK);
  }

  public beginScene(camera: Camera) {
    this.camera = camera;
  }

  public endScene() {}

  public submit(
    shader: Shader,
    vertexArray: VertexArray,
    transform: Transform,
    instanceCount: number
  ) {
    shader.bind();
    vertexArray.bind();
    vertexArray.indexBuffer.bind();

    shader.uniformMatrix4("uMVP", this.camera.projectionViewMatrix);
    shader.uniformMatrix4("uTransform", transform);

    // this.ctx.gl.drawElements(
    //   WebGL.TRIANGLES,
    //   vertexArray.indexBuffer.count,
    //   WebGL.UNSIGNED_BYTE,
    //   0
    // );

    this.ctx.gl.drawElementsInstanced(
      WebGL.TRIANGLES,
      vertexArray.indexBuffer.count,
      WebGL.UNSIGNED_BYTE,
      0,
      instanceCount
    );
  }

  public clear() {
    this.ctx.gl.clearColor(
      this.clearColor[0],
      this.clearColor[1],
      this.clearColor[2],
      this.clearColor[3]
    );
    this.ctx.gl.clearDepth(1.0);

    this.ctx.gl.clear(WebGL.COLOR_BUFFER_BIT | WebGL.DEPTH_BUFFER_BIT);
  }

  public setClearColor(color: glm.vec4) {
    this.clearColor = color;
  }

  public draw(
    vertexArray: VertexArray,
    indexBuffer: IndexBuffer,
    program: Shader
  ) {
    program.bind();
    vertexArray.bind();
    indexBuffer.bind();

    this.ctx.gl.drawElements(
      WebGL.TRIANGLES,
      indexBuffer.count,
      WebGL.UNSIGNED_BYTE,
      0
    );
  }

  public drawInstanced(
    vertexArray: VertexArray,
    program: Shader,
    instanceCount: number
  ) {
    program.bind();
    vertexArray.bind();
    vertexArray.indexBuffer.bind();

    this.ctx.gl.drawElementsInstanced(
      WebGL.TRIANGLES,
      vertexArray.indexBuffer.count,
      WebGL.UNSIGNED_BYTE,
      0,
      instanceCount
    );
  }
}
