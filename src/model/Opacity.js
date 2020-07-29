import PropertyType from 'enums/PropertyTypes';
class Opacity {
    constructor(options) {
        this._type = PropertyType.OPACITY;
        this.opacity = 100;
        if (options.opacity != null)
            this.opacity = options.opacity;
    }
    get type() {
        return this._type;
    }
}
export default Opacity;
