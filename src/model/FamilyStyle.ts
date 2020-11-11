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

  constructor(options?: any) {
    if (options) {
      options.id ? this.id = options.id : this.id = v4();
      if (options.parent) this.parent = options.parent;
      if (options.family) this.family = options.family;
      if (options.style) this.style = options.style;
      if (options.themeMode) this.themeMode = options.themeMode;
      if (options.useToken) this.useToken = options.useToken;
    } else {
      this.id = v4();
    }
  }
  get type (): string {
    return this._type;
  }
}

export default FamilyStyle;
