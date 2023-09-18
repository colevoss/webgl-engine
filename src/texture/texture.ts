import { Context } from "../context";

export abstract class Texture {
  public ctx: Context;
  public texture: WebGLTexture;
  public abstract width: number;
  public abstract height: number;

  constructor(ctx: Context) {
    this.ctx = ctx;

    const texture = this.ctx.gl.createTexture();

    if (!texture) {
      throw new Error("Failed to create texture");
    }

    this.texture = texture;
  }
}
