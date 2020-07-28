import PropertyType from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';

class StrokeFill extends FillColor {
  _type: string = PropertyType.STROKE_FILL;
  color: String = '000000';

  constructor(options?: any) {
    super(options);
    if (options.color != null) this.color = options.color;
  }
  get type (): String {
    return this._type;
  }
}

export default StrokeFill;
