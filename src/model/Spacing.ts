import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class Spacing {
  private _type: string = PropertyType.SPACING;
  id: string = v4();
  parent: string = '';
  value: number = 4;
  useToken: string = '';
  themeMode: string = '';

  constructor(options?: any) {
    if (!options) return;
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.value != null) this.value = options.value;
    if (options.themeMode) this.themeMode = options.themeMode;
  }
  get type (): string {
    return this._type;
  }
}

export default Spacing;
