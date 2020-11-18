import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
class StrokeWidthAlign {
    constructor({ id, parent, useToken, width, align, themeMode }) {
        this._type = PropertyType.STROKE_WIDTH_ALIGN;
        this.id = '';
        this.parent = '';
        this.width = 1;
        this.align = StrokeAligns.INSIDE;
        this.useToken = '';
        this.themeMode = '';
        this.id = id || v4();
        this.parent = parent || this.parent;
        this.useToken = useToken || this.useToken;
        this.width = width || this.width;
        this.align = align || this.align;
        this.themeMode = themeMode || this.themeMode;
    }
    get type() {
        return this._type;
    }
}
export default StrokeWidthAlign;
