import React, { FC, ReactElement } from "react";
import { ThemeModeIcon } from './property-components/ThemeModes';
import useThemeModes from 'hooks/useThemeModes';
import ThemeMode from 'model/ThemeMode';

const ThemeModesSetter: FC = (): ReactElement => {
  const { themeModes, currentMode, getThemeMode, setCurrentMode } = useThemeModes();
  const setThemeMode = (e) => {
    const modeId: string = (e.target.closest('.theme-mode') as HTMLElement).dataset['id'];
    setCurrentMode(getThemeMode(modeId) as ThemeMode);
  }
  return currentMode ? <div className="dropdown theme-modes">
    <ThemeModeIcon title={`Current page's theme mode: ${currentMode.name}`}></ThemeModeIcon>
    <ul className="dropdown-menu dropdown-menu-multi-select pull-right">
      {
        themeModes.map((mode: ThemeMode) =>
          <li key={mode.id} className={ currentMode.id === mode.id ? 'theme-mode selected' : 'theme-mode' } data-id={mode.id} onClick={setThemeMode}>
            <a href="#">{mode.name}{mode.isDefault ? ' (Default)' : ''}</a>
          </li>
        )
      }
    </ul>
  </div> :
  null
};

export default ThemeModesSetter;
