import { Context } from "../context";
import { Shader } from "../shader";
import { VertexBuffer } from "./vertex-buffer";
import { IndexBuffer } from "./index-buffer";
import {
  getGlType,
  getVertexAttributeCount,
  getVertexAttributeSize,
} from "./layout";

export class VertexArray {
  public ctx: Context;
  public shader: Shader;
  public vertexArray: WebGLVertexArrayObject;

  public vertexBuffers: VertexBuffer[] = [];
  public indexBuffer!: IndexBuffer;

  constructor(ctx: Context, shader: Shader) {
    this.ctx = ctx;
    this.shader = shader;

    const vertexArray = ctx.gl.createVertexArray();

    if (!vertexArray) {
      throw new Error("Failed to create vertex array");
    }

    this.vertexArray = vertexArray;
  }

  public bind() {
    this.ctx.gl.bindVertexArray(this.vertexArray);
  }

  public unbind() {
    this.ctx.gl.bindVertexArray(null);
  }

  public addIndexBuffer(indexBuffer: IndexBuffer): this {
    this.bind();
    indexBuffer.bind();

    this.indexBuffer = indexBuffer;

    this.unbind();

    return this;
  }

  /**
   * Binds a buffer to this vertex array and sets the attribute pointers
   */
  public addVertexBuffer(buffer: VertexBuffer): this {
    if (!buffer.vertexLayout) {
      throw new Error("VertexBuffer does not have a layout assigned");
    }

    // Inlining
    this.ctx.gl.bindVertexArray(this.vertexArray);
    buffer.bind();

    let offset = 0;

    for (let i = 0; i < buffer.vertexLayout.elements.length; i++) {
      const element = buffer.vertexLayout.elements[i];

      const loc = this.ctx.gl.getAttribLocation(
        this.shader.program,
        element.name
      );

      if (loc === -1) {
        continue;
      }

      this.ctx.gl.enableVertexAttribArray(loc);
      this.ctx.gl.vertexAttribPointer(
        loc, // location
        element.count * getVertexAttributeCount(element.type),
        getGlType(element.type), // element.type,
        element.normalized,
        buffer.vertexLayout.stride,
        offset
      );

      if (element.div > 0) {
        this.ctx.gl.vertexAttribDivisor(loc, element.div);
      }

      offset += element.count * getVertexAttributeSize(element.type);
    }

    this.vertexBuffers.push(buffer);

    this.unbind();
    return this;
  }
}
