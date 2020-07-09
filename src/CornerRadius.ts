import { v4 } from 'uuid';
import PropertyType from './enums/PropertyTypes';
class CornerRadius {
  private type: string = PropertyType.CORNER_RADIUS;
  private _id: string = v4();
  private _parent: string;
  private _radius: number | symbol = 0;
  private _topLeft: number = 0;
  private _topRight: number = 0;
  private _bottomRight: number = 0;
  private _bottomLeft: number = 0;
  constructor(options?: any) {
    if (options) {
      if (options.id != null) this.id = options.id;
      if (options.parent != null) this.parent = options.parent;
      if (options.radius != null) this.radius = options.radius;
      if (options.topLeft != null) this.topLeft = options.topLeft;
      if (options.topRight != null) this.topRight = options.topRight;
      if (options.bottomRight != null) this.bottomRight = options.bottomRight;
      if (options.bottomLeft != null) this.bottomLeft = options.bottomLeft;
    }
  }
  get id (): string {
    return this._id;
  }
  get parent (): string {
    return this._parent;
  }
  get radius (): number | symbol {
    return this._radius;
  }
  get topLeft (): number {
    return this._topLeft;
  }
  get topRight (): number {
    return this._topRight;
  }
  get bottomRight (): number {
    return this._bottomRight;
  }
  get bottomLeft (): number {
    return this._bottomLeft;
  }
  set id (value: string) {
    this._id = value;
  }
  set parent (value: string) {
    this._parent = value;
  }
  set radius (value: number | symbol) {
    this._radius = value;
  }
  set topLeft (value: number) {
    this._topLeft = value;
  }
  set topRight (value: number) {
    this._topRight = value;
  }
  set bottomRight (value: number) {
    this._bottomRight = value;
  }
  set bottomLeft (value: number) {
    this._bottomLeft = value;
  }
}

export default CornerRadius;
