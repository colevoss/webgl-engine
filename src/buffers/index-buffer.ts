import { WebGL } from "../core";
import { GLBuffer } from "./buffer";

export class IndexBuffer extends GLBuffer<Uint8Array> {
  public get type(): number {
    return WebGL.ELEMENT_ARRAY_BUFFER;
  }

  public get count(): number {
    return this.data.length;
  }

  public buffer(): this {
    this.bind();
    this.ctx.gl.bufferData(this.type, this.data, WebGL.STATIC_DRAW);
    return this;
  }

  public setData(data: number[]): this {
    this.data = new Uint8Array(data);
    return this;
  }
}
