import { useContext } from 'react';
import { ThemeModesContext, ThemeModesSetterContext } from '../ThemeModeProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import ThemeMode from 'model/ThemeMode';

const useThemeModes = () => {
  const { api } = useAPI();
  const { saveThemeModes } = useData();
  const themeModes: Array<ThemeMode> = useContext(ThemeModesContext);
  const { setThemeModes } = useContext(ThemeModesSetterContext);
  const _getThemeMode = (id: string): ThemeMode | Array<ThemeMode> => (themeModes.slice().find(mode => mode.id === id) || themeModes.slice());
  const _removeThemeMode = (mode: ThemeMode) => {
    const nextThemeModes = themeModes.slice().filter(_mode => _mode.id != mode.id);
    saveThemeModes(nextThemeModes)
      .then(res => {
        if (res.success) _setThemeModes(nextThemeModes);
      });
  }
  const _setThemeMode = (mode: ThemeMode) => {
    const nextThemeModes = themeModes.slice();
    const existMode = nextThemeModes.find(_mode => _mode.id === mode.id);
    if (!existMode) nextThemeModes.push(mode);
    saveThemeModes(nextThemeModes)
      .then(res => {
        if (res.success) _setThemeModes(nextThemeModes);
      });
  }
  const _setThemeModes = (modes: Array<ThemeMode> | undefined) => {
    if (modes && modes.length > 0) {
      setThemeModes(modes);
    } else if(themeModes.length === 0 && api.admin) {
      _setThemeMode(new ThemeMode());
    }
  }
  return {
    themeModes,
    getThemeMode: _getThemeMode,
    removeThemeMode: _removeThemeMode,
    setThemeMode: _setThemeMode,
    setThemeModes: _setThemeModes
  };
};

export default useThemeModes;