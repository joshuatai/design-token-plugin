import { useContext, useEffect, useState } from 'react';
import { ThemeModesContext, ThemeModesSetterContext } from '../ThemeModeProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import { sendMessage } from 'model/DataManager';
import ThemeMode from 'model/ThemeMode';
import MessageTypes from 'enums/MessageTypes';
const useThemeModes = () => {
    console.log('useThemeModes');
    const { api } = useAPI();
    const { save } = useData();
    const themeModes = useContext(ThemeModesContext);
    const { setThemeModes } = useContext(ThemeModesSetterContext);
    // const themeModesMap = useContext(ThemeModesMapContext);
    // const { setThemeModesMap } = useContext(ThemeModesMapSetterContext);
    const [themeMode, setThemeMode] = useState(null);
    // const [ themeMadesMapChange, setThemeMadesMapChange ] = useState(false);
    const _getThemeMode = (id) => (themeModes.find(mode => mode.id === id) || themeModes);
    const _removeThemeMode = (mode) => {
        const nextThemeModes = themeModes.filter(_mode => _mode.id != mode.id);
        _setThemeModes(nextThemeModes);
    };
    const _setThemeMode = (mode) => {
        const nextThemeModes = themeModes.slice();
        nextThemeModes.push(mode);
        _setThemeModes(nextThemeModes);
        setThemeMode(mode);
    };
    const _setThemeModes = (modes) => {
        if (modes && modes.length > 0) {
            setThemeModes(modes);
        }
        else if (themeModes.length === 0 && api.admin) {
            _setThemeMode(new ThemeMode());
        }
    };
    useEffect(() => {
        if (api.checked && themeMode) {
            save();
        }
    }, [api.checked, themeMode]);
    useEffect(() => {
        if (themeModes.length > 0) {
            sendMessage(MessageTypes.SET_MODES, themeModes);
        }
    }, [themeModes]);
    // useEffect(() => {
    //   if (!api.checked || themeModes.length === 0 || !themeMadesMapChange) return;
    //   const _themeModesMap = themeModes.reduce((calc, mode) => (calc[mode.id] = mode, calc), {});
    //   if (JSON.stringify(themeModesMap) !== JSON.stringify(_themeModesMap)) {
    //     setThemeModesMap(_themeModesMap);
    //     sendMessage(
    //       MessageTypes.SET_MODES,
    //       themeModes
    //     );
    //   }
    // }, [api.checked, themeModes, themeMadesMapChange]);
    return {
        themeModes,
        getThemeMode: _getThemeMode,
        removeThemeMode: _removeThemeMode,
        setThemeMode: _setThemeMode,
        setThemeModes: _setThemeModes
    };
};
export default useThemeModes;
