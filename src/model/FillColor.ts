import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import FillTypes from 'enums/FillTypes';
import BlendModes from 'enums/BlendModes';

class FillColor {
  protected _type: string = PropertyType.FILL_COLOR;
  id: string = '';
  parent: string = '';
  fillType: string = FillTypes.SOLID;
  color: string = 'C4C4C4';
  opacity: number = 100;
  visible: Boolean = true;
  blendMode: string = BlendModes.NORMAL;
  themeMode: string = "";
  useToken: string = '';

  constructor(options?: any) {
    if (options) {
      options.id ? this.id = options.id : this.id = v4();
      if (options.parent) this.parent = options.parent;
      if (options.fillType != null) this.fillType = options.fillType;
      if (options.color != null) this.color = options.color;
      if (options.opacity != undefined) this.opacity = options.opacity;
      if (options.visible != undefined) this.visible = options.visible;
      if (options.blendMode != undefined) this.blendMode = options.blendMode;
      if (options.useToken) this.useToken = options.useToken;
      if (options.themeMode) this.themeMode = options.themeMode;
    } else {
      this.id = v4();
    }
  }
  get type (): string {
    return this._type;
  }
}

export default FillColor;
