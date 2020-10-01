import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class Font {
    constructor(options) {
        this._type = PropertyType.FONT;
        this.id = v4();
        this.parent = '';
        this.useToken = '';
        this.fontName = {
            family: "Segoe UI",
            style: "Regular"
        };
        this.fontSize = 14;
        if (options.id)
            this.id = options.id;
        if (options.parent)
            this.parent = options.parent;
        if (options.useToken)
            this.useToken = options.useToken;
        if (options.fontName)
            this.fontName = options.fontName;
        if (options.fontSize)
            this.fontSize = options.fontSize;
    }
    get type() {
        return this._type;
    }
}
export default Font;
