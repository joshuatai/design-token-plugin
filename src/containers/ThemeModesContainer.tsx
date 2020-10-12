import React, { FC, useState } from "react";
import useAPI from 'hooks/useAPI';
import useThemeModes from 'hooks/useThemeModes';
import ThemeModeList from './ThemeModeList';
import ThemeMode from 'model/ThemeMode';

const ThemeModesContainer: FC = () => {
  const { api: { admin } } = useAPI();
  const { setThemeMode } = useThemeModes();
  const [ createEnable, setCreateEnable ] = useState(true);
  const createModeHandler = () => {
    const newMode = new ThemeMode({
      name: '',
      isDefault: false
    });
    setCreateEnable(false);
    setThemeMode(newMode);
  };
  return <div id="mode-setting" className="plugin-panel">
    <ThemeModeList creatable={setCreateEnable}></ThemeModeList>
    {
      admin && <button id="mode-creator" onClick={createModeHandler} disabled={!createEnable}>Add a new theme mode</button>
    }
  </div>
};

export default ThemeModesContainer;
