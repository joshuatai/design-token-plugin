import { v4 } from 'uuid';
class Token {
    constructor(param) {
        this.type = 'Token';
        this.id = '';
        this.key = '';
        this.name = '';
        this.description = '';
        this.parent = '';
        this.properties = [];
        const { id, name, description, parent, properties } = param;
        this.id = id || v4();
        this.name = name || this.name;
        this.description = description || this.description;
        this.parent = parent || this.parent;
        this.properties = properties || this.properties;
    }
}
export default Token;
