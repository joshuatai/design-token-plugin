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

  constructor({ id, parent, useToken, width, align, themeMode }: any) {
    this.id = id || v4();
    this.parent = parent || this.parent;
    this.useToken = useToken || this.useToken;
    this.width = width || this.width;
    this.align = align || this.align;
    this.themeMode = themeMode || this.themeMode;
  }
  
  get type (): string {
    return this._type;
  }
}

export default StrokeWidthAlign;
