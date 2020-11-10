import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class FamilyStyle {
    constructor(options) {
        this._type = PropertyType.FONT_FAMILY_STYLE;
        this.id = v4();
        this.parent = '';
        this.useToken = '';
        this.family = 'Segoe UI';
        this.style = 'Regular';
        this.themeMode = '';
        if (options.id)
            this.id = options.id;
        if (options.parent)
            this.parent = options.parent;
        if (options.family)
            this.family = options.family;
        if (options.style)
            this.style = options.style;
        if (options.themeMode)
            this.themeMode = options.themeMode;
        if (options.useToken)
            this.useToken = options.useToken;
    }
    get type() {
        return this._type;
    }
}
export default FamilyStyle;
