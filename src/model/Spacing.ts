import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';

class Spacing {
  private _type: string = PropertyType.SPACING;
  id: string = '';
  parent: string = '';
  value: number = 4;
  useToken: string = '';
  themeMode: string = '';

  constructor({ id, parent, useToken, value, themeMode }: any) {
    this.id = id || v4();
    this.parent = parent || this.parent;
    this.useToken = useToken || this.useToken;
    this.value = value || this.value;
    this.themeMode = themeMode || this.themeMode;
  }

  get type (): string {
    return this._type;
  }
}

export default Spacing;
