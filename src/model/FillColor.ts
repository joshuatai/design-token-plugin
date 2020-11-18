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
  visible: boolean = true;
  blendMode: BlendModes = BlendModes.NORMAL;
  themeMode: string = '';
  useToken: string = '';

  constructor({ id, parent, fillType, color, opacity, visible, blendMode, useToken, themeMode }: any) {
    this.id = id || v4();
    this.parent = parent || this.parent;
    this.fillType = fillType || this.fillType;
    this.color = color || this.color;
    this.blendMode = blendMode || this.blendMode;
    this.useToken = useToken || this.useToken;
    this.themeMode = themeMode || this.themeMode;
    if (opacity !== undefined) this.opacity = opacity;
    if (visible !== undefined) this.visible = visible;
  }

  get type (): string {
    return this._type;
  }
}

export default FillColor;
