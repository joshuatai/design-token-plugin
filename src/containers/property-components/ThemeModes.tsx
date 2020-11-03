import React, { FC, ReactElement } from "react";
import useThemeModes from 'hooks/useThemeModes';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import PropertyTypes from 'enums/PropertyTypes';
import Property from 'model/Property';
import ThemeMode from 'model/ThemeMode';
import Token from 'model/Token';

type T_ThemeModeIcon = {
  title: string
}
export const ThemeModeIcon: FC<T_ThemeModeIcon> = ({
  title = ''
}: T_ThemeModeIcon): ReactElement => 
<div className="themem-mode-list" data-toggle="dropdown" title={title}>
  <span className="tmicon tmicon-sun"></span>
  <span className="tmicon tmicon-moon"></span>
</div>;

type T_ThemeModes = {
  property: Property,
  useThemeHandler: Function
}
const ThemeModes: FC<T_ThemeModes> = ({
  property = null,
  useThemeHandler = null
}: T_ThemeModes): ReactElement => {
  const { themeModes, defaultMode } = useThemeModes();
  const { getToken } = useTokens();
  const { getProperty } = useProperties();
  const { type, themeMode } = property;
  let title = 'Change a theme mode';

  const selectHandler = (mode: ThemeMode) => (e) => {
    e.target.closest('li').classList.contains('disabled') ? '' : useThemeHandler(mode);
  }
  const ThemeModeItems = themeModes.map((mode: ThemeMode) => {
    let selected = false;
    let className = ['mode-item'];

    if ((!themeMode && mode.isDefault) || themeMode === mode.id) {
      selected = true;
      title = mode.name;
      className.push('selected');
    }
    if (property.useToken) {
      const availibleTheme = (getToken(property.useToken) as Token).properties.find(propId => {
        const propertyTheme = (getProperty(propId) as Property).themeMode;
        return propertyTheme === defaultMode.id || propertyTheme === mode.id;
      });
      if (!availibleTheme) className.push('disabled');
    }
    return <li 
      key={`mode-id-${mode.id}`}
      className={className.join(' ')}
    >
      <a href="#" onClick={selectHandler(mode)}>{mode.name}{mode.isDefault ? ' (Default)' : ''}</a>
    </li>
  });

  return themeModes.length > 1 && (type === PropertyTypes.OPACITY || type === PropertyTypes.FILL_COLOR || type === PropertyTypes.STROKE_FILL) ? <div className="dropdown">
      <ThemeModeIcon title={title}></ThemeModeIcon>
      <ul className="dropdown-menu dropdown-menu-multi-select pull-right">
        {ThemeModeItems}
      </ul>
    </div>: null
};
export default ThemeModes;
