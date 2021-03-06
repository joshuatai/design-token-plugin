import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import FillTypes from 'enums/FillTypes';
import BlendModes from 'enums/BlendModes';

class FillColor {
  protected _type: string = PropertyType.FILL_COLOR;
  id: String = v4();
  parent: String = '';
  fillType: String = FillTypes.SOLID;
  color: String = 'C4C4C4';
  opacity: number = 1;
  visible: Boolean = true;
  blendMode: String = BlendModes.NORMAL;
  themeMode: String = "";
  useToken: String = '';

  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.fillType != null) this.fillType = options.fillType;
    if (options.color != null) this.color = options.color;
    if (options.opacity != undefined) this.opacity = options.opacity;
    if (options.visible != undefined) this.visible = options.visible;
    if (options.blendMode != undefined) this.blendMode = options.blendMode;
    if (options.useToken) this.useToken = options.useToken;
    if (options.themeMode) this.themeMode = options.themeMode;
  }
  get type (): String {
    return this._type;
  }
}

export default FillColor;
