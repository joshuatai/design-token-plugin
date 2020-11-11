import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class Opacity {
    constructor(options) {
        this._type = PropertyType.OPACITY;
        this.id = '';
        this.parent = '';
        this.opacity = 100;
        this.themeMode = "";
        this.useToken = '';
        if (options) {
            options.id ? this.id = options.id : this.id = v4();
            if (options.parent)
                this.parent = options.parent;
            if (options.useToken)
                this.useToken = options.useToken;
            if (options.opacity != null)
                this.opacity = options.opacity;
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
export default Opacity;
