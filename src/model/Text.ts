import PropertyType from 'enums/PropertyTypes';

class FontSize {
  _type: string = PropertyType.TEXT;
  fontSize: number = 12;

  constructor(options?: any) {
    if (options.fontSize != null) this.fontSize = options.fontSize;
  }
  get type (): String {
    return this._type;
  }
}

export default FontSize;
