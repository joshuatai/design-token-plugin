import PropertyType from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';
class StrokeFill extends FillColor {
    constructor(options) {
        super(options);
        this._type = PropertyType.STROKE_FILL;
        this.color = '000000';
        if (options.color != null)
            this.color = options.color;
    }
    get type() {
        return this._type;
    }
}
export default StrokeFill;
