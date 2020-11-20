import { useContext } from 'react';
import { groupsContext, groupsSetterContext } from '../GroupProvider';
import Group from 'model/Group';
const useGroups = () => {
    const groups = useContext(groupsContext);
    const { setGroups } = useContext(groupsSetterContext);
    const _getGroup = (id) => {
        const group = groups.slice().find(group => group.id === id);
        return group ? new Group(group) : groups.slice();
    };
    const _getGroupName = () => {
        const lastNumber = _getGroup()
            .filter(group => (group.name.match(/^Group \d+$/) ? true : false))
            .map(group => (Number(group.name.replace('Group ', ''))))
            .sort()
            .pop();
        return `Group ${lastNumber ? lastNumber + 1 : 1}`;
    };
    const _removeGroup = (group) => {
        const nextGroups = groups.slice().filter(_group => _group.id != group.id);
        _setAllGroups(nextGroups);
        return nextGroups;
    };
    const _addGroup = (group) => {
        const _group = new Group(group);
        const nextGroups = groups.slice();
        const existIndex = nextGroups.findIndex(group => group.id === _group.id);
        if (existIndex === -1) {
            nextGroups.push(_group);
        }
        else {
            nextGroups.splice(existIndex, 1, _group);
        }
        _setAllGroups(nextGroups);
        return nextGroups;
    };
    const _setAllGroups = (_groups = []) => {
        setGroups(_groups);
    };
    return {
        groups,
        getGroupName: _getGroupName,
        getGroup: _getGroup,
        removeGroup: _removeGroup,
        addGroup: _addGroup,
        setAllGroups: _setAllGroups
    };
};
export default useGroups;
