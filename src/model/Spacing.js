import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class Spacing {
    constructor(options) {
        this._type = PropertyType.SPACING;
        this.id = '';
        this.parent = '';
        this.value = 4;
        this.useToken = '';
        this.themeMode = '';
        if (options) {
            options.id ? this.id = options.id : this.id = v4();
            if (options.id)
                this.id = options.id;
            if (options.parent)
                this.parent = options.parent;
            if (options.useToken)
                this.useToken = options.useToken;
            if (options.value != null)
                this.value = options.value;
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
export default Spacing;
