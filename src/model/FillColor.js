import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import FillTypes from 'enums/FillTypes';
import BlendModes from 'enums/BlendModes';
class FillColor {
    constructor(options) {
        this._type = PropertyType.FILL_COLOR;
        this.id = v4();
        this.parent = '';
        this.fillType = FillTypes.SOLID;
        this.color = 'C4C4C4';
        this.opacity = 100;
        this.visible = true;
        this.blendMode = BlendModes.NORMAL;
        this.themeMode = "";
        this.useToken = '';
        if (options.id)
            this.id = options.id;
        if (options.parent)
            this.parent = options.parent;
        if (options.fillType != null)
            this.fillType = options.fillType;
        if (options.color != null)
            this.color = options.color;
        if (options.opacity != undefined)
            this.opacity = options.opacity;
        if (options.visible != undefined)
            this.visible = options.visible;
        if (options.blendMode != undefined)
            this.blendMode = options.blendMode;
        if (options.useToken)
            this.useToken = options.useToken;
        if (options.themeMode)
            this.themeMode = options.themeMode;
    }
    get type() {
        return this._type;
    }
}
export default FillColor;
