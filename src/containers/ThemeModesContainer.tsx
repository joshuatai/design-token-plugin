import React, { FC, useState } from "react";
import useAPI from 'hooks/useAPI';
import useThemeModes from 'hooks/useThemeModes';
import ThemeModeList from './ThemeModeList';
import ThemeMode from 'model/ThemeMode';

const ThemeModesContainer: FC = () => {
  const { api: { admin } } = useAPI();
  const { addThemeMode } = useThemeModes();
  const [ createEnable, setCreateEnable ] = useState(true);
  const createModeHandler = () => {
    const newMode = new ThemeMode({
      name: '',
      isDefault: false
    });
    setCreateEnable(false);
    addThemeMode(newMode);
  };

  return <div id="mode-setting" className="plugin-panel">
    <ThemeModeList creatable={setCreateEnable}></ThemeModeList>
    {
      admin && <button id="mode-creator" onClick={createModeHandler} disabled={!createEnable}>Create A Theme Mode</button>
    }
  </div>
};

export default ThemeModesContainer;
