import { WebGL } from "../core";
import { GLBuffer } from "./buffer";
import { VertexBufferLayout, VertexAttributeArray } from "./layout";

export abstract class VertexBuffer extends GLBuffer<Float32Array> {
  public vertexLayout?: VertexBufferLayout;

  public get type(): GLenum {
    return WebGL.ARRAY_BUFFER;
  }

  public layout(layout: VertexAttributeArray): this;
  public layout(layout: VertexBufferLayout): this;
  public layout(layout: VertexBufferLayout | VertexAttributeArray): this {
    if (this.vertexLayout) {
      throw new Error("Cannot set new VertexBufferLayout on vertex buffer");
    }

    if (layout instanceof VertexBufferLayout) {
      this.vertexLayout = layout;
    } else {
      this.vertexLayout = new VertexBufferLayout(layout);
    }

    return this;
  }
}

export class StaticVertexBuffer extends VertexBuffer {
  public get count(): number {
    return this.data.length / this.vertexLayout!.count;
  }

  public buffer(): this {
    this.bind();
    this.ctx.gl.bufferData(this.type, this.data, WebGL.STATIC_DRAW);
    return this;
  }

  public setData(data: number[]): this {
    this.data = new Float32Array(data);
    return this;
  }
}
