import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
class CornerRadius {
    constructor(options) {
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
        if (options) {
            options.id ? this.id = options.id : this.id = v4();
            if (options.parent)
                this.parent = options.parent;
            if (options.useToken)
                this.useToken = options.useToken;
            if (options.radius != null)
                this.radius = options.radius === 'Mixed' ? Mixed : options.radius;
            if (options.topLeft != null)
                this.topLeft = options.topLeft;
            if (options.topRight != null)
                this.topRight = options.topRight;
            if (options.bottomRight != null)
                this.bottomRight = options.bottomRight;
            if (options.bottomLeft != null)
                this.bottomLeft = options.bottomLeft;
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
export default CornerRadius;
