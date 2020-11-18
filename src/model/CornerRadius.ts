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
  id: string = '';
  parent: string = '';
  radius: number | symbol = 0;
  topLeft: number = 0;
  topRight: number = 0;
  bottomRight: number = 0;
  bottomLeft: number = 0;
  useToken: string = '';
  themeMode: string = '';

  constructor({ id, parent, useToken, radius, topLeft, topRight, bottomRight, bottomLeft, themeMode }: any) {
    this.id = id || v4();
    this.parent = parent || this.parent;
    this.useToken = useToken || this.useToken;
    this.radius = radius ? radius === 'Mixed' ? Mixed : radius : this.radius;
    this.topLeft = topLeft || this.topLeft;
    this.topRight = topRight || this.topRight;
    this.bottomRight = bottomRight || this.bottomRight;
    this.bottomLeft = bottomLeft || this.bottomLeft;
    this.themeMode = themeMode || this.themeMode;
  }

  get type (): string {
    return this._type;
  }
}

export default CornerRadius;
