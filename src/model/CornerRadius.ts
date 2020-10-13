import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';

class CornerRadius {
  private _type: string = PropertyType.CORNER_RADIUS;
  id: string = v4();
  parent: string = '';
  radius: number | symbol = 0;
  topLeft: number = 0;
  topRight: number = 0;
  bottomRight: number = 0;
  bottomLeft: number = 0;
  useToken: string = '';

  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.radius != null) this.radius = typeof options.radius === 'number' ? options.radius : Mixed;
    if (options.topLeft != null) this.topLeft = options.topLeft;
    if (options.topRight != null) this.topRight = options.topRight;
    if (options.bottomRight != null) this.bottomRight = options.bottomRight;
    if (options.bottomLeft != null) this.bottomLeft = options.bottomLeft;
  }
  get type (): string {
    return this._type;
  }
}

export default CornerRadius;
