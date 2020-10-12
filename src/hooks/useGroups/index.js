import { useContext } from 'react';
import { groupsContext, groupsSetterContext } from '../GroupProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
const useGroups = () => {
    const { api } = useAPI();
    const { saveGroups } = useData();
    const groups = useContext(groupsContext);
    const { setGroups } = useContext(groupsSetterContext);
    const _getGroup = (id) => (groups.slice().find(group => group.id === id) || groups.slice());
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
        saveGroups(nextGroups)
            .then(res => {
            if (res.success)
                _setGroups(nextGroups);
        });
    };
    const _setGroup = (group) => {
        const nextGroups = groups.slice();
        const existGroup = nextGroups.find(_group => _group.id === group.id);
        if (!existGroup)
            nextGroups.push(group);
        saveGroups(nextGroups)
            .then(res => {
            if (res.success)
                _setGroups(nextGroups);
        });
    };
    const _setGroups = (_goups) => {
        if (_goups) {
            setGroups(_goups);
        }
    };
    return {
        groups,
        getGroupName: _getGroupName,
        getGroup: _getGroup,
        removeGroup: _removeGroup,
        setGroup: _setGroup,
        setGroups: _setGroups
    };
};
export default useGroups;
