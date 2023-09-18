import { Context } from "../context";
import { Texture } from "./texture";
import { WebGL } from "../core";

const defaultPixel = new Uint8Array([255, 0, 255, 255]);

export class Texture2D extends Texture {
  public src: string;
  public buffer: HTMLImageElement | null = null;

  public border: number = 0;
  public internalFormat: GLenum = WebGL.RGBA;
  public srcFormat: GLenum = WebGL.RGBA;
  public srcType: GLenum = WebGL.UNSIGNED_BYTE;
  public level: number = 0;

  public loaded: boolean = false;
  public width: number = 1;
  public height: number = 1;

  constructor(ctx: Context, src: string) {
    super(ctx);

    this.src = src;
    // this.buffer = new Image();

    this.loadDefault();
    // this.load();
  }

  public load(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const buffer = new Image();

      buffer.addEventListener("load", () => {
        this.loaded = true;
        this.width = buffer.width;
        this.height = buffer.height;
        this.loadTexture(buffer);
        // buffer = null;
        resolve();
      });

      buffer.src = this.src;
    });
  }

  private loadTexture(buffer: HTMLImageElement) {
    this.bind();
    this.ctx.gl.texParameteri(
      WebGL.TEXTURE_2D,
      WebGL.TEXTURE_MIN_FILTER,
      WebGL.NEAREST
    );

    this.ctx.gl.texParameteri(
      WebGL.TEXTURE_2D,
      WebGL.TEXTURE_MAG_FILTER,
      WebGL.NEAREST
    );

    this.ctx.gl.texImage2D(
      WebGL.TEXTURE_2D, // target
      0, // level
      this.internalFormat, // Internal format
      this.width, // width
      this.height, // height
      this.border, // border
      this.srcFormat, // format
      this.srcType, // height
      buffer // data
    );
  }

  private loadDefault() {
    this.bind();
    this.ctx.gl.texImage2D(
      WebGL.TEXTURE_2D,
      this.level,
      this.internalFormat,
      1, // Default width 1
      1, // Default height 1
      this.border,
      this.srcFormat,
      this.srcType,
      defaultPixel
    );
  }

  public bind(slot: number = 0) {
    this.ctx.gl.pixelStorei(WebGL.UNPACK_FLIP_Y_WEBGL, true);
    this.ctx.gl.activeTexture(WebGL.TEXTURE0 + slot);
    this.ctx.gl.bindTexture(WebGL.TEXTURE_2D, this.texture);

    // this.loaded ? this.loadTexture() : this.loadDefault();
  }

  public unbind() {
    this.ctx.gl.bindTexture(WebGL.TEXTURE_2D, null);
  }
}
