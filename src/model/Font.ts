import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class Font {
  _type: string = PropertyType.FONT;
  id: string = v4();
  parent: string = '';
  useToken: string = '';
  fontName = {
    family: "Segoe UI",
    style: "Regular"
  };
  fontSize = 14;

  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.fontName) this.fontName = options.fontName;
    if (options.fontSize) this.fontSize = options.fontSize;
  }
  get type (): string {
    return this._type;
  }
}

export default Font;
