import { useContext } from 'react';
import { tokenSettingContext, tokenSettingSetterContext, T_TokenSetting } from '../TokenSettingProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import Token from 'model/Token';
import Group from 'model/Group';

const useTokenSetting = () => {
  const { api } = useAPI();
  const setting: T_TokenSetting = useContext(tokenSettingContext);
  const { setTokenSetting } = useContext(tokenSettingSetterContext);
  
  const _setGroup = (group: Group) => {
    setTokenSetting({
      ...setting,
      groupId: group.id,
      groupName: group.name
    });
  }
  const _setToken = (token: Token) => {
    setTokenSetting({
      ...setting,
      token
    });
  }
  // const _getGroup = (id?: String): Group | Array<Group> => (groups.slice().find(group => group.id === id) || groups.slice());
  // const _getGroupName = () => {
  //   const lastNumber = (_getGroup() as Array<Group>)
  //     .filter(group => (group.name.match(/^Group \d+$/) ? true : false))
  //     .map(group => (Number(group.name.replace('Group ', ''))))
  //     .sort()
  //     .pop();
  //   return `Group ${lastNumber ? lastNumber + 1 : 1}`;
  // }
  // const _removeGroup = (group: Group) => {
  //   const nextGroups = groups.slice().filter(_group => _group.id != group.id);
  //   saveGroups(nextGroups)
  //     .then(res => {
  //       if (res.success) _setGroups(nextGroups);
  //     });
  // }
  // const _setGroup = (group: Group) => {
  //   const nextGroups = groups.slice();
  //   const existGroup = nextGroups.find(_group => _group.id === group.id);
  //   if (!existGroup) nextGroups.push(group);
  //   saveGroups(nextGroups)
  //     .then(res => {
  //       if (res.success) _setGroups(nextGroups);
  //     });
  // }
  // const _setGroups = (_goups: Array<Group> | undefined) => {
  //   if (_goups) {
  //     setGroups(_goups);
  //   }
  // }
  return {
    setting,
    setGroup: _setGroup,
    setToken: _setToken
  };
};

export default useTokenSetting;