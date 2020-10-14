import { useContext } from 'react';
import { ThemeModesContext, ThemeModesSetterContext, defaultModeContext, defaultModeContextSetterContext } from '../ThemeModeProvider';
import useAPI from 'hooks/useAPI';
import ThemeMode from 'model/ThemeMode';

const useThemeModes = () => {
  const { api } = useAPI();
  const defaultMode: ThemeMode = useContext(defaultModeContext);
  const { setDefaultMode } = useContext(defaultModeContextSetterContext);
  const themeModes: Array<ThemeMode> = useContext(ThemeModesContext);
  const { setThemeModes } = useContext(ThemeModesSetterContext);
  const _getThemeMode = (id: string): ThemeMode | Array<ThemeMode> => (themeModes.slice().find(mode => mode.id === id) || themeModes.slice());
  const _removeThemeMode = (mode: ThemeMode) => {
    const nextThemeModes = themeModes.slice().filter(_mode => _mode.id != mode.id);
    _setAllThemeModes(nextThemeModes);
    return nextThemeModes;
  }
  const _addThemeMode = (mode: ThemeMode) => {
    const nextThemeModes = themeModes.slice();
    const existIndex = nextThemeModes.findIndex(_mode => _mode.id === mode.id);
    if (existIndex === -1) {
      nextThemeModes.push(mode);
    } else {
      nextThemeModes.splice(existIndex, 1, mode);
    }
    _setAllThemeModes(nextThemeModes);
    return nextThemeModes;
  }
  const _setAllThemeModes = (modes: Array<ThemeMode> = []) => {
    setDefaultMode(modes.find(mode => mode.isDefault));
    setThemeModes(modes);
  }
  return {
    defaultMode,
    themeModes,
    getThemeMode: _getThemeMode,
    removeThemeMode: _removeThemeMode,
    addThemeMode: _addThemeMode,
    setAllThemeModes: _setAllThemeModes
  };
};

export default useThemeModes;