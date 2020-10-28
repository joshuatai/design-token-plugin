import React from "react";
import { ThemeModeIcon } from './property-components/ThemeModes';
import useThemeModes from 'hooks/useThemeModes';
// import { setCurrentThemeMode } from "model/DataManager";
const ThemeModesSetter = () => {
    const { themeModes, currentMode, getThemeMode, setCurrentMode } = useThemeModes();
    const setThemeMode = (e) => {
        const modeId = e.target.closest('.theme-mode').dataset['id'];
        setCurrentMode(getThemeMode(modeId));
    };
    return currentMode ? React.createElement("div", { className: "dropdown theme-modes" },
        React.createElement(ThemeModeIcon, { title: currentMode.name }),
        React.createElement("ul", { className: "dropdown-menu dropdown-menu-multi-select pull-right" }, themeModes.map((mode) => React.createElement("li", { key: mode.id, className: currentMode.id === mode.id ? 'theme-mode selected' : 'theme-mode', "data-id": mode.id, onClick: setThemeMode },
            React.createElement("a", { href: "#" },
                mode.name,
                mode.isDefault ? ' (Default)' : ''))))) :
        null;
};
export default ThemeModesSetter;
