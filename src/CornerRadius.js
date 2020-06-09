import { v4 } from 'uuid';
import PropertyType from './PropertyTypes';
class CornerRadius {
    constructor(options) {
        this.type = PropertyType.CORNER_RADIUS;
        this._id = v4();
        this._radius = 0;
        this._topLeft = 0;
        this._topRight = 0;
        this._bottomRight = 0;
        this._bottomLeft = 0;
        if (options) {
            if (options.id != null)
                this.id = options.id;
            if (options.parent != null)
                this.parent = options.parent;
            if (options.radius != null)
                this.radius = options.radius;
            if (options.topLeft != null)
                this.topLeft = options.topLeft;
            if (options.topRight != null)
                this.topRight = options.topRight;
            if (options.bottomRight != null)
                this.bottomRight = options.bottomRight;
            if (options.bottomLeft != null)
                this.bottomLeft = options.bottomLeft;
        }
    }
    get id() {
        return this._id;
    }
    get parent() {
        return this._parent;
    }
    get radius() {
        return this._radius;
    }
    get topLeft() {
        return this._topLeft;
    }
    get topRight() {
        return this._topRight;
    }
    get bottomRight() {
        return this._bottomRight;
    }
    get bottomLeft() {
        return this._bottomLeft;
    }
    set id(value) {
        this._id = value;
    }
    set parent(value) {
        this._parent = value;
    }
    set radius(value) {
        this._radius = value;
    }
    set topLeft(value) {
        this._topLeft = value;
    }
    set topRight(value) {
        this._topRight = value;
    }
    set bottomRight(value) {
        this._bottomRight = value;
    }
    set bottomLeft(value) {
        this._bottomLeft = value;
    }
}
export default CornerRadius;
