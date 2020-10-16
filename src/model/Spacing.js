import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class Spacing {
    constructor(options) {
        this._type = PropertyType.SPACING;
        this.id = v4();
        this.parent = '';
        this.value = 4;
        this.useToken = '';
        if (!options)
            return;
        if (options.id)
            this.id = options.id;
        if (options.parent)
            this.parent = options.parent;
        if (options.useToken)
            this.useToken = options.useToken;
        if (options.value != null)
            this.value = options.value;
    }
    get type() {
        return this._type;
    }
}
export default Spacing;
