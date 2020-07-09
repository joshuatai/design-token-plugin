import { v4 } from 'uuid';
import Token from './Token';
import { setToken } from '../model/DataManager';
class Group {
  type: string = 'Group';
  id: string = '';
  name: string = '';
  tokens: Array<Token> = [];
  constructor(param) {
    const  { id, name } = param;
    this.id = id || v4();
    this.name = name;
  }
}

export default Group;
