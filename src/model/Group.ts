import { v4 } from 'uuid';
import Token from './Token';
class Group {
  type: string = 'Group';
  id: string = '';
  name: string = '';
  tokens: string[] = [];
  constructor(param) {
    const  { id, name, tokens = [] } = param;
    this.id = id || v4();
    this.name = name;
    this.tokens = tokens;
  }
}

export default Group;
