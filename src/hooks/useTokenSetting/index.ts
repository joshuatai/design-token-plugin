import { useContext } from 'react';
import { initialTokenSetting, tokenSettingContext, tokenSettingSetterContext, T_TokenSetting } from '../TokenSettingProvider';
import useAPI from 'hooks/useAPI';
import Token from 'model/Token';
import Group from 'model/Group';

const useTokenSetting = () => {
  const { api } = useAPI();
  const setting: T_TokenSetting = useContext(tokenSettingContext);
  const { setTokenSetting } = useContext(tokenSettingSetterContext);
  
  const _setGroup = (group: Group) => {
    setTokenSetting({
      ...setting,
      group
    });
  }
  const _setToken = (token: Token) => {
    setTokenSetting({
      ...setting,
      token
    });
  }
  const _setTokenSetting = (tokenSetting: T_TokenSetting) => {
    setTokenSetting(tokenSetting);
  }

  return {
    initialSetting: initialTokenSetting,
    setting,
    setGroup: _setGroup,
    setToken: _setToken,
    setTokenSetting: _setTokenSetting
  };
};

export default useTokenSetting;