import { v4 } from 'uuid';

class ThemeMode {
  private _type: string = 'ThemeMode';
  id: string = '';
  name: string = '';
  isDefault = false;
  constructor(param?: any) {
    if (param) {
      const  { id, name = "", isDefault = false } = param;
      this.id = id || v4();
      if (name) this.name = name;
      if (isDefault !== undefined) this.isDefault = isDefault;
    } else {
      this.id = v4();
      this.isDefault = true;
      this.name = 'Default';
    }
  }
  get type (): string {
    return this._type;
  }
}

export default ThemeMode;
