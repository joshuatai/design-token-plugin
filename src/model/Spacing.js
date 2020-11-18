import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class Spacing {
    constructor({ id, parent, useToken, value, themeMode }) {
        this._type = PropertyType.SPACING;
        this.id = '';
        this.parent = '';
        this.value = 4;
        this.useToken = '';
        this.themeMode = '';
        this.id = id || v4();
        this.parent = parent || this.parent;
        this.useToken = useToken || this.useToken;
        this.value = value || this.value;
        this.themeMode = themeMode || this.themeMode;
    }
    get type() {
        return this._type;
    }
}
export default Spacing;
