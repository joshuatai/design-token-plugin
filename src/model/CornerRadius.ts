import { v4 } from 'uuid';
import PropertyType from '../enums/PropertyTypes';

class CornerRadius {
  private _type: string = PropertyType.CORNER_RADIUS;
  public id: String = v4();
  public parent: String;
  public radius: number | symbol = 0;
  public topLeft: number = 0;
  public topRight: number = 0;
  public bottomRight: number = 0;
  public bottomLeft: number = 0;
  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.radius != null) this.radius = options.radius;
    if (options.topLeft != null) this.topLeft = options.topLeft;
    if (options.topRight != null) this.topRight = options.topRight;
    if (options.bottomRight != null) this.bottomRight = options.bottomRight;
    if (options.bottomLeft != null) this.bottomLeft = options.bottomLeft;
  }
  get type (): String {
    return this._type;
  }
}

export default CornerRadius;
