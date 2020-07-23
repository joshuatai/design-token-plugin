import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class StrokeColor {
    constructor(options) {
        this._type = PropertyType.STROKE_COLOR;
        this.id = v4();
        this.parent = '';
        this.color = 1;
        this.useToken = '';
        if (options.id)
            this.id = options.id;
        if (options.parent)
            this.parent = options.parent;
        if (options.useToken)
            this.useToken = options.useToken;
        if (options.color != null)
            this.color = options.color;
    }
    get type() {
        return this._type;
    }
}
export default StrokeColor;
