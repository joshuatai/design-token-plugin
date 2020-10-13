import { useContext } from 'react';
import { groupsContext, groupsSetterContext } from '../GroupProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import Group from 'model/Group';


const useGroups = () => {
  const { api } = useAPI();
  const { saveGroups } = useData();
  const groups: Array<Group> = useContext(groupsContext);
  const { setGroups } = useContext(groupsSetterContext);
  
  const _getGroup = (id?: string): Group | Array<Group> => (groups.slice().find(group => group.id === id) || groups.slice());
  const _getGroupName = () => {
    const lastNumber = (_getGroup() as Array<Group>)
      .filter(group => (group.name.match(/^Group \d+$/) ? true : false))
      .map(group => (Number(group.name.replace('Group ', ''))))
      .sort()
      .pop();
    return `Group ${lastNumber ? lastNumber + 1 : 1}`;
  }
  const _removeGroup = (group: Group) => {
    const nextGroups = groups.slice().filter(_group => _group.id != group.id);
    _setAllGroups(nextGroups);
    return nextGroups;
  }
  const _addGroup = (group: Group) => {
    const nextGroups = groups.slice();
    const existIndex = nextGroups.findIndex(_group => _group.id === group.id);
    if (existIndex === -1) {
      nextGroups.push(group);
    } else {
      nextGroups.splice(existIndex, 1, group);
    }
    _setAllGroups(nextGroups);
    return nextGroups;
  }
  const _setAllGroups = (_groups: Array<Group> = []) => {
    setGroups(_groups);
  }
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