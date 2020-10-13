import { useContext } from 'react';
import { initialTokenSetting, tokenSettingContext, tokenSettingSetterContext } from '../TokenSettingProvider';
import useAPI from 'hooks/useAPI';
const useTokenSetting = () => {
    const { api } = useAPI();
    const setting = useContext(tokenSettingContext);
    const { setTokenSetting } = useContext(tokenSettingSetterContext);
    const _setGroup = (group) => {
        setTokenSetting(Object.assign(Object.assign({}, setting), { group }));
    };
    const _setToken = (token) => {
        setTokenSetting(Object.assign(Object.assign({}, setting), { token }));
    };
    const _setTokenSetting = (tokenSetting) => {
        setTokenSetting(tokenSetting);
    };
    return {
        initialSetting: initialTokenSetting,
        setting,
        setGroup: _setGroup,
        setToken: _setToken,
        setTokenSetting: _setTokenSetting
    };
};
export default useTokenSetting;
