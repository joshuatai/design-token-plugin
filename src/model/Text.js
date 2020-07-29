import PropertyType from 'enums/PropertyTypes';
class FontSize {
    constructor(options) {
        this._type = PropertyType.TEXT;
        this.fontSize = 12;
        if (options.fontSize != null)
            this.fontSize = options.fontSize;
    }
    get type() {
        return this._type;
    }
}
export default FontSize;
