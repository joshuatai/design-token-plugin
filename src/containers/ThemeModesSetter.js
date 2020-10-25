import React from "react";
import { ThemeModeIcon } from './property-components/ThemeModes';
import useThemeModes from 'hooks/useThemeModes';
const ThemeModesSetter = () => {
    const { themeModes } = useThemeModes();
    const setThemeMode = (e) => {
    };
    return React.createElement("div", { className: "dropdown theme-modes" },
        React.createElement(ThemeModeIcon, { title: "XXX" }),
        React.createElement("ul", { className: "dropdown-menu dropdown-menu-multi-select pull-right" }, themeModes.map((mode) => React.createElement("li", { key: mode.id, className: "theme-mode", "data-id": mode.id, onClick: setThemeMode },
            React.createElement("a", { href: "#" },
                mode.name,
                mode.isDefault ? ' (Default)' : '')))));
};
export default ThemeModesSetter;
