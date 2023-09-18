import { mat4, vec3, glMatrix } from "gl-matrix";
import { Context } from "../context";

export abstract class Camera {
  public projectionMatrix: mat4;
  public viewMatrix: mat4;
  public ctx: Context;

  public inverseMatrix: mat4;
  public projectionViewMatrix: mat4;

  public position: vec3;
  public rotation: number;

  constructor(ctx: Context) {
    this.ctx = ctx;

    this.viewMatrix = this.initView();
    this.projectionMatrix = mat4.create();
    this.projectionViewMatrix = mat4.create();

    this.position = vec3.create();
    this.rotation = 0;

    this.inverseMatrix = mat4.create();
  }

  protected abstract initProjection(): void;

  protected initView(): mat4 {
    return mat4.create();
  }

  public lookAt(focalPoint: mat4) {
    const translation = vec3.create();
    mat4.getTranslation(translation, focalPoint);

    mat4.lookAt(this.viewMatrix, this.position, translation, [0, 1, 0]);
    this.calculateProjectionMatrix();
  }

  public translate(vec: vec3): this {
    vec3.add(this.position, this.position, vec);
    this.calculateProjectionMatrix();

    return this;
  }

  public setPosition(position: vec3): this {
    this.position = position;
    this.calculateProjectionMatrix();
    return this;
  }

  public setRotation(rotation: number): this {
    this.rotation = glMatrix.toRadian(rotation);
    this.calculateProjectionMatrix();
    return this;
  }

  public init() {
    this.initProjection();
    this.calculateProjectionMatrix();
  }

  public calculateProjectionMatrix() {
    mat4.fromTranslation(this.viewMatrix, this.position);

    mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.rotation);
    mat4.invert(this.inverseMatrix, this.viewMatrix);

    mat4.multiply(
      this.projectionViewMatrix,
      this.projectionMatrix,
      this.inverseMatrix
    );
  }

  static init<C extends Camera, T extends CameraClass<C>>(
    this: T,
    ...args: CameraConstructArgs<C, T>
  ): InstanceType<T> {
    const inst = new this(...args) as InstanceType<T>;

    inst.init();

    return inst;
  }
}

type CameraClass<C extends Camera> = {
  new (...args: any[]): C;
};

type CameraConstructArgs<
  C extends Camera,
  T extends CameraClass<C>
> = ConstructorParameters<T>;
