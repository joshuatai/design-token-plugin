import { v4 } from 'uuid';
class Token {
  type: string = 'Token';
  id: string = '';
  key: string = '';
  name: string = '';
  description: string = '';
  parent: string = '';
  properties: object[] = [];

  constructor(param) {
    const { id, name, description, parent, properties } = param;
    this.id = id || v4();
    this.name = name || this.name;
    this.description = description || this.description;
    this.parent = parent || this.parent;
    this.properties = properties || this.properties;
  }
}

export default Token;
