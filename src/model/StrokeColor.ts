import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class StrokeColor {
  private _type: string = PropertyType.STROKE_COLOR;
  id: String = v4();
  parent: String = '';
  color: number = 1;
  useToken: String = '';

  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.color != null) this.color = options.color;
  }
  get type (): String {
    return this._type;
  }
}

export default StrokeColor;
