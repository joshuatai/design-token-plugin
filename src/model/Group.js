import { v4 } from 'uuid';
class Group {
    constructor(param) {
        this.type = 'Group';
        this.id = '';
        this.name = '';
        this.tokens = [];
        const { id, name, tokens = [] } = param;
        this.id = id || v4();
        this.name = name;
        this.tokens = tokens;
    }
}
export default Group;
