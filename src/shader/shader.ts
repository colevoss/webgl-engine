import { Context } from "../context";
import { VertexShaderSource, FragmentShaderSource } from "./source";
import { WebGL } from "../core";

export class Shader {
  private vertexSource: VertexShaderSource;
  private fragmentSource: FragmentShaderSource;
  private ctx: Context;

  public readonly program: WebGLProgram;
  private uniforms: Map<string, WebGLUniformLocation> = new Map();

  constructor(
    ctx: Context,
    vertexSource: VertexShaderSource,
    fragmentSource: FragmentShaderSource
  ) {
    this.ctx = ctx;
    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;

    const program = this.ctx.gl.createProgram();

    if (!program) {
      throw new Error("Failed to create program");
    }

    this.program = program;

    // Maybe move this to the compile function
    const vertexShader = this.vertexSource.load(this);
    const fragmentShader = this.fragmentSource.load(this);

    this.compile(vertexShader, fragmentShader);

    this.extractUniforms();
  }

  /**
   * Use this shader's program
   */
  public bind(): this {
    this.ctx.gl.useProgram(this.program);
    return this;
  }

  /**
   * Unbind/stop using this shader's program
   */
  public unbind(): this {
    this.ctx.gl.useProgram(null);
    return this;
  }

  public getParameters(param: number) {
    return this.ctx.gl.getProgramParameter(this.program, param);
  }

  public delete() {
    this.ctx.gl.deleteProgram(this.program);
  }

  /**
   * Get a uniform's location in from this shader. This value
   * is precomputed when the shader is compiled so this function
   * gets the value from a cache map created at compile time
   */
  public getUniformLocation(uniform: string): WebGLUniformLocation | null {
    return this.uniforms.get(uniform) || null;
  }

  public getLogInfo() {
    return this.ctx.gl.getProgramInfoLog(this.program);
  }

  //////////////////////////////////////////////////
  // Uniform Setters
  //////////////////////////////////////////////////

  // The functions below are convenient functions to set various types
  // of uniform values for the shader by wrapping the WebGL native functions
  // and using the uniform location cache created at shader compile time.

  ////////////
  // Float
  ////////////

  public uniform1f(uniform: string, value: number): this {
    this.ctx.gl.uniform1f(this.getUniformLocation(uniform), value);
    return this;
  }

  public uniform2f(uniform: string, a: number, b: number): this {
    this.ctx.gl.uniform2f(this.getUniformLocation(uniform), a, b);
    return this;
  }

  public uniform3f(uniform: string, a: number, b: number, c: number): this {
    this.ctx.gl.uniform3f(this.getUniformLocation(uniform), a, b, c);
    return this;
  }

  public uniform4f(
    uniform: string,
    a: number,
    b: number,
    c: number,
    d: number
  ): this {
    this.ctx.gl.uniform4f(this.getUniformLocation(uniform), a, b, c, d);
    return this;
  }

  ////////////
  // Float Vecs
  ////////////

  public uniform1fv(uniform: string, list: Float32List) {
    this.ctx.gl.uniform1fv(this.getUniformLocation(uniform), list);
    return this;
  }

  public uniform2fv(uniform: string, list: Float32List) {
    this.ctx.gl.uniform2fv(this.getUniformLocation(uniform), list);
    return this;
  }

  public uniform3fv(uniform: string, list: Float32List) {
    this.ctx.gl.uniform3fv(this.getUniformLocation(uniform), list);
    return this;
  }

  public uniform4fv(uniform: string, list: Float32List) {
    this.ctx.gl.uniform4fv(this.getUniformLocation(uniform), list);
    return this;
  }

  ////////////
  // Int
  ////////////

  public uniform1i(uniform: string, a: number): this {
    this.ctx.gl.uniform1i(this.getUniformLocation(uniform), a);
    return this;
  }

  public uniform2i(uniform: string, a: number, b: number): this {
    this.ctx.gl.uniform2i(this.getUniformLocation(uniform), a, b);
    return this;
  }

  public uniform3i(uniform: string, a: number, b: number, c: number): this {
    this.ctx.gl.uniform3i(this.getUniformLocation(uniform), a, b, c);
    return this;
  }

  public uniform4i(
    uniform: string,
    a: number,
    b: number,
    c: number,
    d: number
  ) {
    this.ctx.gl.uniform4i(this.getUniformLocation(uniform), a, b, c, d);
    return this;
  }

  ////////////
  // Int Vecs
  ////////////

  public uniform1iv(uniform: string, list: Int32List): this {
    this.ctx.gl.uniform1iv(this.getUniformLocation(uniform), list);
    return this;
  }

  public uniform2iv(uniform: string, list: Int32List): this {
    this.ctx.gl.uniform2iv(this.getUniformLocation(uniform), list);
    return this;
  }

  public uniform3iv(uniform: string, list: Int32List): this {
    this.ctx.gl.uniform3iv(this.getUniformLocation(uniform), list);
    return this;
  }

  public uniform4iv(uniform: string, list: Int32List): this {
    this.ctx.gl.uniform4iv(this.getUniformLocation(uniform), list);
    return this;
  }

  ////////////
  // Unsigned Ints
  ////////////

  public uniform1u(uniform: string, a: number): this {
    this.ctx.gl.uniform1ui(this.getUniformLocation(uniform), a);
    return this;
  }

  public uniform2u(uniform: string, a: number, b: number): this {
    this.ctx.gl.uniform2ui(this.getUniformLocation(uniform), a, b);
    return this;
  }

  public uniform3u(uniform: string, a: number, b: number, c: number): this {
    this.ctx.gl.uniform3ui(this.getUniformLocation(uniform), a, b, c);
    return this;
  }

  public uniform4u(
    uniform: string,
    a: number,
    b: number,
    c: number,
    d: number
  ): this {
    this.ctx.gl.uniform4ui(this.getUniformLocation(uniform), a, b, c, d);
    return this;
  }

  ////////////
  // Matrix
  ////////////

  public uniformMatrix2(uniform: string, mat: Float32List): this {
    this.ctx.gl.uniformMatrix2fv(this.getUniformLocation(uniform), false, mat);
    return this;
  }

  public uniformMatrix3(uniform: string, mat: Float32List): this {
    this.ctx.gl.uniformMatrix3fv(this.getUniformLocation(uniform), false, mat);
    return this;
  }

  public uniformMatrix4(uniform: string, mat: Float32List): this {
    this.ctx.gl.uniformMatrix4fv(this.getUniformLocation(uniform), false, mat);
    return this;
  }

  public createVertexShader(source: string): WebGLShader {
    return this.createShader(source, WebGL.VERTEX_SHADER);
  }

  public createFragmentShader(source: string): WebGLShader {
    return this.createShader(source, WebGL.FRAGMENT_SHADER);
  }

  private createShader(source: string, type: GLenum): WebGLShader {
    const shader = this.ctx.gl.createShader(type);

    if (!shader) {
      throw new Error("Failed to create shader");
    }

    this.ctx.gl.shaderSource(shader, source);

    this.ctx.gl.compileShader(shader);

    if (!this.ctx.gl.getShaderParameter(shader, WebGL.COMPILE_STATUS)) {
      throw new Error(
        `Failed to compile shader: ${this.ctx.gl.getShaderInfoLog(shader)}`
      );
    }

    return shader;
  }

  /**
   * Get's a uniform's location from the shader program. This is used at compile time
   * after parsing the uniform names and types from the shader
   */
  private getProgramUniformLocation(
    uniform: string
  ): WebGLUniformLocation | null {
    return this.ctx.gl.getUniformLocation(this.program, uniform);
  }

  private compile(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.ctx.gl.attachShader(this.program, vertexShader);
    this.ctx.gl.attachShader(this.program, fragmentShader);
    this.ctx.gl.linkProgram(this.program);
    this.ctx.gl.validateProgram(this.program);

    // Detach and delete shaders
    this.ctx.gl.detachShader(this.program, vertexShader);
    this.ctx.gl.deleteShader(vertexShader);

    // Detach and delete shaders
    this.ctx.gl.detachShader(this.program, fragmentShader);
    this.ctx.gl.deleteShader(fragmentShader);

    const success = this.getParameters(WebGL.LINK_STATUS);

    if (!success) {
      this.delete();
      // console.error("An error occurred in program linking");
      throw new Error(`Failed to link shaders to program ${this.getLogInfo()}`);
    }

    return this;
  }

  /**
   * Cache the location of the uniforms in the shader
   */
  private extractUniforms() {
    const shaders = [this.vertexSource, this.fragmentSource];

    for (const shader of shaders) {
      const uniformInfo = shader.parseUniforms();

      for (const { key } of uniformInfo) {
        const location = this.getProgramUniformLocation(key);

        if (location === null) {
          continue;
        }

        this.uniforms.set(key, location);
      }
    }
  }
}
