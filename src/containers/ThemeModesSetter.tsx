import React, { FC, ReactElement } from "react";
import { ThemeModeIcon } from './property-components/ThemeModes';
import useThemeModes from 'hooks/useThemeModes';
import ThemeMode from 'model/ThemeMode';

const ThemeModesSetter: FC = (): ReactElement => {
  const { themeModes } = useThemeModes();
  const setThemeMode = (e) => {

  }

  return <div className="dropdown theme-modes">
    <ThemeModeIcon title="XXX"></ThemeModeIcon>
    <ul className="dropdown-menu dropdown-menu-multi-select pull-right">
      {
        themeModes.map((mode: ThemeMode) =>
          <li key={mode.id} className="theme-mode" data-id={mode.id} onClick={setThemeMode}>
            <a href="#">{mode.name}{mode.isDefault ? ' (Default)' : ''}</a>
          </li>
        )
      }
    </ul>
  </div>;
};

export default ThemeModesSetter;
