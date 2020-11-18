import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class Opacity {
    constructor({ id, parent, useToken, opacity, themeMode }) {
        this._type = PropertyType.OPACITY;
        this.id = '';
        this.parent = '';
        this.opacity = 100;
        this.themeMode = '';
        this.useToken = '';
        this.id = id || v4();
        this.parent = parent || this.parent;
        this.useToken = useToken || this.useToken;
        this.themeMode = themeMode || this.themeMode;
        if (opacity !== null)
            this.opacity = opacity;
    }
    get type() {
        return this._type;
    }
}
export default Opacity;
