import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class FamilyStyle {
  _type: string = PropertyType.FONT_FAMILY_STYLE;
  id: string = '';
  parent: string = '';
  useToken: string = '';
  family: string = 'Segoe UI';
  style: string = 'Regular';
  themeMode = '';

  constructor({ id, parent, family, style, themeMode, useToken }: any) {
    this.id = id || v4();
    this.parent = parent || this.parent;
    this.family = family || this.family;
    this.style = style || this.style;
    this.themeMode = themeMode || this.themeMode;
    this.useToken = useToken || this.useToken;
  }

  get type (): string {
    return this._type;
  }
}

export default FamilyStyle;
