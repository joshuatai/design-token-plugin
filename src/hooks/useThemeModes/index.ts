import { useContext } from 'react';
import { ThemeModesContext, ThemeModesSetterContext, defaultModeContext, defaultModeContextSetterContext, currentModeContext, currentModeSetterContext } from '../ThemeModeProvider';
import ThemeMode from 'model/ThemeMode';
import MessageTypes from 'enums/MessageTypes';
import { sendMessage } from 'model/DataManager';

const useThemeModes = () => {
  const defaultMode: ThemeMode = useContext(defaultModeContext);
  const { setDefaultMode } = useContext(defaultModeContextSetterContext);
  const currentMode = useContext(currentModeContext);
  const { setCurrentMode } = useContext(currentModeSetterContext);
  const themeModes: Array<ThemeMode> = useContext(ThemeModesContext);
  const { setThemeModes } = useContext(ThemeModesSetterContext);
  const _getThemeMode = (id?: string): ThemeMode | Array<ThemeMode> => (themeModes.slice().find(mode => mode.id === id) || themeModes.slice());
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
    sendMessage(
      MessageTypes.SET_MODES,
      modes
    );
  }
  const _fetchCurrentMode = () => {
    sendMessage(MessageTypes.FETCH_CURRENT_THEME_MODE);
  }
  const _setCurrentMode = (mode: ThemeMode) => {
    setCurrentMode(mode);
    sendMessage(
      MessageTypes.SET_CURRENT_THEME_MODE,
      mode.id
    );
  }
  const _updateCurrentMode = () => {
    sendMessage(MessageTypes.SYNC_CURRENT_THEME_MODE);
  }

  return {
    defaultMode,
    themeModes,
    currentMode,
    fetchCurrentMode: _fetchCurrentMode,
    setCurrentMode: _setCurrentMode,
    updateCurrentMode: _updateCurrentMode,
    getThemeMode: _getThemeMode,
    removeThemeMode: _removeThemeMode,
    addThemeMode: _addThemeMode,
    setAllThemeModes: _setAllThemeModes
  };
};

export default useThemeModes;