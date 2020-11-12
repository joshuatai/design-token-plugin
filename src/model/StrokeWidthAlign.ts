import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';

class StrokeWidthAlign {
  private _type: string = PropertyType.STROKE_WIDTH_ALIGN;
  id: string = '';
  parent: string = '';
  width: number = 1;
  align: StrokeAligns = StrokeAligns.INSIDE;
  useToken: string = '';
  themeMode: string ='';

  constructor(options?: any) {
    if (options) {
      options.id ? this.id = options.id : this.id = v4();
      if (options.parent) this.parent = options.parent;
      if (options.useToken) this.useToken = options.useToken;
      if (options.width != null) this.width = options.width;
      if (options.align != null) this.align = options.align;
      if (options.themeMode) this.themeMode = options.themeMode;
    } else {
      this.id = v4();
    }
  }
  get type (): string {
    return this._type;
  }
}

export default StrokeWidthAlign;
