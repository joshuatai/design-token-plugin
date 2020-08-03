import PropertyType from 'enums/PropertyTypes';

class Text {
  _type: string = PropertyType.TEXT;
  fontName = {
    family: "Segoe UI",
    style: "Regular"
  };

  constructor(options?: any) {
    if (options.fontName) this.fontName = options.fontName;
  }
  get type (): String {
    return this._type;
  }
}

export default Text;
