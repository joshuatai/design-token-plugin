import { v4 } from 'uuid';
class Group {
    constructor({ id, name, tokens = [] }) {
        this.type = 'Group';
        this.id = '';
        this.name = '';
        this.tokens = [];
        this.id = id || v4();
        this.name = name || this.name;
        this.tokens = tokens || this.tokens;
    }
}
export default Group;
