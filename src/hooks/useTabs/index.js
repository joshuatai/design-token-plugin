import { useContext } from 'react';
import { tabContext, tabSetterContext } from '../TabProvider';
const useTabs = () => {
    const tab = useContext(tabContext);
    const { setTab } = useContext(tabSetterContext);
    const _setTab = (_tab) => {
        setTab(_tab);
    };
    return {
        tab,
        setTab: _setTab
    };
};
export default useTabs;
