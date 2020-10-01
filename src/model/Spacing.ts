import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class Spacing {
  private _type: string = PropertyType.SPACING;
  id: String = v4();
  parent: String = '';
  value: number = 4;
  useToken: String = '';

  constructor(options?: any) {
    if (options.id) this.id = options.id;
    if (options.parent) this.parent = options.parent;
    if (options.useToken) this.useToken = options.useToken;
    if (options.value != null) this.value = options.value;
  }
  get type (): String {
    return this._type;
  }
}

export default Spacing;
