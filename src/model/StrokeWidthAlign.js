import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
class StrokeWidthAlign {
    constructor(options) {
        this._type = PropertyType.STROKE_WIDTH_ALIGN;
        this.id = '';
        this.parent = '';
        this.width = 1;
        this.align = StrokeAligns.INSIDE;
        this.useToken = '';
        this.themeMode = '';
        if (options) {
            options.id ? this.id = options.id : this.id = v4();
            if (options.parent)
                this.parent = options.parent;
            if (options.useToken)
                this.useToken = options.useToken;
            if (options.width != null)
                this.width = options.width;
            if (options.align != null)
                this.align = options.align;
            if (options.themeMode)
                this.themeMode = options.themeMode;
        }
        else {
            this.id = v4();
        }
    }
    get type() {
        return this._type;
    }
}
export default StrokeWidthAlign;
