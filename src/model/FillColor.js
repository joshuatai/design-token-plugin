import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import FillTypes from 'enums/FillTypes';
import BlendModes from 'enums/BlendModes';
class FillColor {
    constructor({ id, parent, fillType, color, opacity, visible, blendMode, useToken, themeMode }) {
        this._type = PropertyType.FILL_COLOR;
        this.id = '';
        this.parent = '';
        this.fillType = FillTypes.SOLID;
        this.color = 'C4C4C4';
        this.opacity = 100;
        this.visible = true;
        this.blendMode = BlendModes.NORMAL;
        this.themeMode = '';
        this.useToken = '';
        this.id = id || v4();
        this.parent = parent || this.parent;
        this.fillType = fillType || this.fillType;
        this.color = color || this.color;
        this.blendMode = blendMode || this.blendMode;
        this.useToken = useToken || this.useToken;
        this.themeMode = themeMode || this.themeMode;
        if (opacity !== undefined)
            this.opacity = opacity;
        if (visible !== undefined)
            this.visible = visible;
    }
    get type() {
        return this._type;
    }
}
export default FillColor;
