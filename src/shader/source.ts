import { Shader } from "./shader";

export enum ShaderType {
  Vertex,
  Fragment,
}

type UniformInfo = {
  key: string;
  type: string;
};

export abstract class ShaderSource {
  public readonly source: string;
  private static UniformRegex = /uniform (?<type>\w+\d)\s(?<key>\w+);/g;

  constructor(source: string) {
    this.source = source;
  }

  public abstract get type(): ShaderType;
  abstract load(shader: Shader): WebGLShader;

  /**
   * Parse the uniform name and types from the shader source string using regex.
   * This could probably be done more efficiently or just better in general with
   * some sort of GLSL library, but for now this is all we need.
   */
  public parseUniforms(): UniformInfo[] {
    const uniformMatches = this.source.matchAll(ShaderSource.UniformRegex);
    const uniformInfo = [];

    for (const match of uniformMatches) {
      if (!match.groups) {
        continue;
      }

      const info = {
        key: match.groups.key,
        type: match.groups.type,
      };

      // console.log(info);

      uniformInfo.push(info);
    }

    return uniformInfo;
  }

  public static vertex(strings: TemplateStringsArray, ...values: string[]) {
    const source = this.appendTemplate(strings, values);
    return new VertexShaderSource(source);
  }

  public static fragment(strings: TemplateStringsArray, ...values: string[]) {
    const source = this.appendTemplate(strings, values);
    return new FragmentShaderSource(source);
  }

  private static appendTemplate(
    strings: TemplateStringsArray,
    values: string[]
  ) {
    return (
      "#version 300 es" +
      values.reduce((acc, val, i) => {
        return acc + val + strings[i + 1];
      }, strings[0])
    );
  }
}

export class VertexShaderSource extends ShaderSource {
  public get type(): ShaderType {
    return ShaderType.Vertex;
  }

  public load(shader: Shader): WebGLShader {
    return shader.createVertexShader(this.source);
  }
}

export class FragmentShaderSource extends ShaderSource {
  public get type(): ShaderType {
    return ShaderType.Fragment;
  }

  public load(shader: Shader): WebGLShader {
    return shader.createFragmentShader(this.source);
  }
}

export type ShaderSourcePair = [VertexShaderSource, FragmentShaderSource];
