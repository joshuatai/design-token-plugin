import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import Property from './Property';
class Opacity implements Property {
  private _type: string = PropertyType.OPACITY;
  id: string = '';
  parent: string = '';
  opacity: number = 100;
  themeMode: string = "";
  useToken: string = '';

  constructor(options?: any) {
    if (options) {
      options.id ? this.id = options.id : this.id = v4();
      if (options.parent) this.parent = options.parent;
      if (options.useToken) this.useToken = options.useToken;
      if (options.opacity != null) this.opacity = options.opacity;
      if (options.themeMode) this.themeMode = options.themeMode;
    } else {
      this.id = v4();
    }
  }
  get type (): string {
    return this._type;
  }
}

export default Opacity;
