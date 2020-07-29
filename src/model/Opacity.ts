import PropertyType from 'enums/PropertyTypes';

class Opacity {
  _type: string = PropertyType.OPACITY;
  opacity: number = 100;

  constructor(options?: any) {
    if (options.opacity != null) this.opacity = options.opacity;
  }
  get type (): String {
    return this._type;
  }
}

export default Opacity;
