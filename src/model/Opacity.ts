import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class Opacity {
  private _type: string = PropertyType.OPACITY;
  id: String = v4();
  parent: String = '';
  opacity: number = 100;
  themeMode: String = "";
  useToken: String = '';

  constructor(options?: any) {
    if (!options) return;
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.opacity != null) this.opacity = options.opacity;
    if (options.themeMode) this.themeMode = options.themeMode;
  }
  get type (): String {
    return this._type;
  }
}

export default Opacity;
