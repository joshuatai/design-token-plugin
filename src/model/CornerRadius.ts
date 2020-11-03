import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';

interface I_CornerRadius {
  id: string,
  parent: string,
  radius: number | symbol,
  topLeft: number,
  topRight: number,
  bottomRight: number,
  bottomLeft: number,
  useToken: string,
  themeMode: string
}
class CornerRadius implements I_CornerRadius {
  private _type: string = PropertyType.CORNER_RADIUS;
  id: string = v4();
  parent: string = '';
  radius: number | symbol = 0;
  topLeft: number = 0;
  topRight: number = 0;
  bottomRight: number = 0;
  bottomLeft: number = 0;
  useToken: string = '';
  themeMode: string = '';

  constructor(options?: any) {
    if (!options) return;
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.radius != null) this.radius = options.radius === 'Mixed' ? Mixed : options.radius;
    if (options.topLeft != null) this.topLeft = options.topLeft;
    if (options.topRight != null) this.topRight = options.topRight;
    if (options.bottomRight != null) this.bottomRight = options.bottomRight;
    if (options.bottomLeft != null) this.bottomLeft = options.bottomLeft;
    if (options.themeMode) this.themeMode = options.themeMode;
  }
  get type (): string {
    return this._type;
  }
}

export default CornerRadius;
