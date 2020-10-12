import React, { FC, ReactElement, useContext } from "react";
import useThemeModes from 'hooks/useThemeModes';
import PropertyTypes from 'enums/PropertyTypes';

type T_ThemeModeIcon = {
  title: string
}
export const ThemeModeIcon: FC<T_ThemeModeIcon> = ({
  title = 'Change theme mode'
}: T_ThemeModeIcon): ReactElement => {
  return <div className="themem-mode-list" data-toggle="dropdown" title={title}>
    <span className="tmicon tmicon-sun"></span>
    <span className="tmicon tmicon-moon"></span>
  </div>
};



type T_ThemeModeItem = {
  mode,
  selected: boolean
};
const ThemeModeItem = ({
  mode,
  selected = false
}) => {
  return <li className={ selected ? 'mode-item selected' : 'mode-item' } data-index="${index}" data-id={mode.id}>
    <a href="#">{mode.name}{mode.isDefault ? ' (Default)' : ''}</a>
  </li>
};

type T_ThemeModes = {
  property
}
const ThemeModes = ({
  property: { type, themeMode }
}) => {
  const { themeModes } = useThemeModes();
  let title = '';

  const ThemeModeItems = themeModes.map(mode => {
    let selected = false;
    if ((!themeMode && mode.isDefault) || themeMode === mode.id) {
      selected = true;
      title = mode.name;
      //             options.themeMode = mode.id;
    }
    return <ThemeModeItem key={mode.id} selected={selected} mode={mode} ></ThemeModeItem>
  });

  return themeModes.length > 1 && (type === PropertyTypes.OPACITY || type === PropertyTypes.FILL_COLOR || type === PropertyTypes.STROKE_FILL) ? <div className="dropdown">
      <ThemeModeIcon title={title}></ThemeModeIcon>
      <ul className="dropdown-menu dropdown-menu-multi-select pull-right">
        {ThemeModeItems}
      </ul>
    </div>: null
};

export default ThemeModes;
