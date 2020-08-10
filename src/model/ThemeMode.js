import { v4 } from 'uuid';
class ThemeMode {
    constructor(param) {
        this._type = 'ThemeMode';
        this.id = '';
        this.name = '';
        this.isDefault = false;
        if (param) {
            const { id, name = "", isDefault = false } = param;
            this.id = id || v4();
            if (name)
                this.name = name;
            if (isDefault !== undefined)
                this.isDefault = isDefault;
        }
        else {
            this.id = v4();
            this.isDefault = true;
            this.name = 'Default';
        }
    }
    get type() {
        return this._type;
    }
}
export default ThemeMode;
