import { v4 } from 'uuid';
import { Mixed } from 'symbols/index';
class Token {
  type: string = 'Token';
  id: string = '';
  key: string = '';
  name: string = '';
  description: string = '';
  parent: string = '';
  properties: object[] = [];
  propertyType: string | symbol = '';

  constructor(param) {
    const { id, name, description, parent, properties, propertyType } = param;
    this.id = id || v4();
    this.name = name || this.name;
    this.description = description || this.description;
    this.parent = parent || this.parent;
    this.properties = properties || this.properties;
    this.propertyType = propertyType || this.propertyType;
  }
}

export default Token;
