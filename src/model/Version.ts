import { v4 } from 'uuid';

class Version {
  private _type: string = 'Version';
  id: string = '';
  name: string = '';
  hash: string = '';
  timestamp: number;
  data: [];
  constructor(param: any = {}) {
    const time = new Date();
    const  { id = v4(), name = time.toUTCString(), timestamp = time.getTime(), hash = '', data = [] } = param;
    this.id = id;
    this.timestamp = timestamp;
    this.name = name;
    this.hash = hash;
    this.data = data;
  }
  get type (): string {
    return this._type;
  }
}

export default Version;
