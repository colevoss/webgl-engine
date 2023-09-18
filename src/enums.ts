import { WebGL } from "./core";

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
    // return GLVertexAttributeType.Float;
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
