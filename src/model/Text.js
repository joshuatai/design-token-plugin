import PropertyType from 'enums/PropertyTypes';
class Text {
    constructor(options) {
        this._type = PropertyType.TEXT;
        this.fontName = {
            family: "Segoe UI",
            style: "Regular"
        };
        if (options.fontName)
            this.fontName = options.fontName;
    }
    get type() {
        return this._type;
    }
}
export default Text;
