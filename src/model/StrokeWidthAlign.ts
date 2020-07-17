import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';

class StrokeWidthAlign {
  private _type: string = PropertyType.STROKE_WIDTH_ALIGN;
  id: String = v4();
  parent: String = '';
  width: number = 1;
  align: String = StrokeAligns.INSIDE;
  useToken: String = '';

  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.width != null) this.width = options.width;
    if (options.align != null) this.align = options.align;
  }
  get type (): String {
    return this._type;
  }
}

export default StrokeWidthAlign;
