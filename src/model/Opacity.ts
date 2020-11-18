import { v4 } from 'uuid';
import PropertyType from 'enums/PropertyTypes';
import Property from './Property';
class Opacity implements Property {
  private _type: string = PropertyType.OPACITY;
  id: string = '';
  parent: string = '';
  opacity: number = 100;
  themeMode: string = '';
  useToken: string = '';

  constructor({ id, parent, useToken, opacity, themeMode }: any) {
    this.id = id || v4();
    this.parent = parent || this.parent;
    this.useToken = useToken || this.useToken;
    this.themeMode = themeMode || this.themeMode;
    if (opacity !== null) this.opacity = opacity;
  }

  get type (): string {
    return this._type;
  }
}

export default Opacity;
