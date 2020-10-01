import { v4 } from 'uuid';
class Version {
    constructor(param = {}) {
        this._type = 'Version';
        this.id = '';
        this.name = '';
        this.hash = '';
        const time = new Date();
        const { id = v4(), name = time.toUTCString(), timestamp = time.getTime(), hash = '', data = [] } = param;
        this.id = id;
        this.timestamp = timestamp;
        this.name = name;
        this.hash = hash;
        this.data = data;
    }
    get type() {
        return this._type;
    }
}
export default Version;
