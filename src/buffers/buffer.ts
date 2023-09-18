import { Context } from "../context";

export abstract class GLBuffer<D extends ArrayBufferView> {
  public ctx: Context;
  public glBuffer: WebGLBuffer;

  public data!: D;

  public abstract get type(): GLenum;
  public abstract get count(): number;

  constructor(ctx: Context) {
    this.ctx = ctx;
    const buffer = this.ctx.gl.createBuffer();

    if (!buffer) {
      throw new Error("Could not create vertex buffer");
    }

    this.glBuffer = buffer;
  }

  public abstract buffer(): this;

  public bind(): this {
    this.ctx.gl.bindBuffer(this.type, this.glBuffer);
    return this;
  }

  public unbind(): this {
    this.ctx.gl.bindBuffer(this.type, null);
    return this;
  }

  public abstract setData(data: number[]): this;
}
