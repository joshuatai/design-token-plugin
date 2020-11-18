import PropertyType from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';
class StrokeFill extends FillColor {
    constructor(param) {
        super(param);
        this._type = PropertyType.STROKE_FILL;
        this.color = '000000';
        if (param.color != null)
            this.color = param.color;
    }
    get type() {
        return this._type;
    }
}
export default StrokeFill;
