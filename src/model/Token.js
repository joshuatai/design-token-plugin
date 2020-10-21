import { v4 } from 'uuid';
import { Mixed } from 'symbols/index';
class Token {
    constructor(param) {
        this.type = 'Token';
        this.id = '';
        this.key = '';
        this.name = '';
        this.description = '';
        this.parent = '';
        this.properties = [];
        this.propertyType = '';
        const { id, name, description, parent, properties, propertyType } = param;
        this.id = id || v4();
        this.name = name || this.name;
        this.description = description || this.description;
        this.parent = parent || this.parent;
        this.properties = properties || this.properties;
        this.propertyType = propertyType ? propertyType === 'Mixed' ? Mixed : propertyType : this.propertyType;
    }
}
export default Token;
