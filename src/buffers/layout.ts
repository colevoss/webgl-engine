import { WebGL } from "../core";

export class VertexBufferLayout {
  public elements: VertexAttribute[] = [];
  public stride: number = 0;
  public count: number = 0;

  constructor(attrs?: VertexAttributeArray) {
    if (attrs) {
      this.addMany(attrs);
    }
  }

  public addMany(elements: VertexAttribute[]) {
    for (const element of elements) {
      this.add(element);
    }
  }

  public add(element: VertexAttribute): this {
    this.elements.push(element);

    this.stride += element.count * getVertexAttributeSize(element.type);
    this.count += element.count * getVertexAttributeCount(element.type);

    return this;
  }
}

export type VertexAttributeArray = VertexAttribute[];

class VertexAttribute {
  public name: string = "";
  public count: number;
  public type: VertexAttributeType;
  public normalized: boolean = false;
  public div: number = 0;

  constructor(
    name: string,
    count: number,
    type: VertexAttributeType,
    normalize = false
  ) {
    this.name = name;
    this.count = count;
    this.type = type;
    this.normalized = normalize;
  }

  public normalize(): this {
    this.normalized = true;
    return this;
  }

  public divisor(divisor: number): this {
    this.div = divisor;
    return this;
  }
}

export function Float(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Float);
}

export function Vec2(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Vec2);
}

export function Vec3(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Vec3);
}

export function Vec4(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Vec4);
}

export function Mat2(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Mat2);
}

export function Mat3(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Mat3);
}

export function Mat4(name: string, count: number = 1): VertexAttribute {
  return new VertexAttribute(name, count, VertexAttributeType.Mat4);
}

export enum VertexAttributeType {
  Float,
  Vec2,
  Vec3,
  Vec4,
  Mat2,
  Mat3,
  Mat4,
}

export function getVertexAttributeCount(type: VertexAttributeType) {
  switch (type) {
    case VertexAttributeType.Float:
      return 1;
    case VertexAttributeType.Vec2:
      return 2;
    case VertexAttributeType.Vec3:
      return 3;
    case VertexAttributeType.Vec4:
      return 4;
    case VertexAttributeType.Mat2:
      return 2 * 2;
    case VertexAttributeType.Mat3:
      return 3 * 3;
    case VertexAttributeType.Mat4:
      return 4 * 4;
  }
}

export function getGlType(type: VertexAttributeType) {
  switch (type) {
    case VertexAttributeType.Float:
    case VertexAttributeType.Vec2:
    case VertexAttributeType.Vec3:
    case VertexAttributeType.Vec4:
    case VertexAttributeType.Mat2:
    case VertexAttributeType.Mat3:
    case VertexAttributeType.Mat4:
      return WebGL.FLOAT;
  }
}

export function getVertexAttributeSize(type: VertexAttributeType) {
  switch (type) {
    case VertexAttributeType.Float:
      return 4;
    case VertexAttributeType.Vec2:
      return 4 * 2;
    case VertexAttributeType.Vec3:
      return 4 * 3;
    case VertexAttributeType.Vec4:
      return 4 * 4;
    case VertexAttributeType.Mat2:
      return 4 * 2 * 2;
    case VertexAttributeType.Mat3:
      return 4 * 3 * 3;
    case VertexAttributeType.Mat4:
      return 4 * 4 * 4;
  }
}
