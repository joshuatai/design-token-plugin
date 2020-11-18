import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
class CornerRadius {
    constructor({ id, parent, useToken, radius, topLeft, topRight, bottomRight, bottomLeft, themeMode }) {
        this._type = PropertyType.CORNER_RADIUS;
        this.id = '';
        this.parent = '';
        this.radius = 0;
        this.topLeft = 0;
        this.topRight = 0;
        this.bottomRight = 0;
        this.bottomLeft = 0;
        this.useToken = '';
        this.themeMode = '';
        this.id = id || v4();
        this.parent = parent || this.parent;
        this.useToken = useToken || this.useToken;
        this.radius = radius ? radius === 'Mixed' ? Mixed : radius : this.radius;
        this.topLeft = topLeft || this.topLeft;
        this.topRight = topRight || this.topRight;
        this.bottomRight = bottomRight || this.bottomRight;
        this.bottomLeft = bottomLeft || this.bottomLeft;
        this.themeMode = themeMode || this.themeMode;
    }
    get type() {
        return this._type;
    }
}
export default CornerRadius;
