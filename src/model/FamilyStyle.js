import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
class FamilyStyle {
    constructor({ id, parent, family, style, themeMode, useToken }) {
        this._type = PropertyType.FONT_FAMILY_STYLE;
        this.id = '';
        this.parent = '';
        this.useToken = '';
        this.family = 'Segoe UI';
        this.style = 'Regular';
        this.themeMode = '';
        this.id = id || v4();
        this.parent = parent || this.parent;
        this.family = family || this.family;
        this.style = style || this.style;
        this.themeMode = themeMode || this.themeMode;
        this.useToken = useToken || this.useToken;
    }
    get type() {
        return this._type;
    }
}
export default FamilyStyle;
