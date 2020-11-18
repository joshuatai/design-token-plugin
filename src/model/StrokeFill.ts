import PropertyType from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';

class StrokeFill extends FillColor {
  _type: string = PropertyType.STROKE_FILL;
  color: string = '000000';

  constructor(param: any) {
    super(param);
    if (param.color != null) this.color = param.color;
  }

  get type (): string {
    return this._type;
  }
}

export default StrokeFill;
