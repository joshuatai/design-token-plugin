import { v4 } from 'uuid';
class Group {
  type: string = 'Group';
  id: string = '';
  name: string = '';
  tokens: string[] = [];

  constructor({ id, name, tokens = [] }: any) {
    this.id = id || v4();
    this.name = name || this.name;
    this.tokens = tokens || this.tokens;
  }
}

export default Group;
