import React from "react";
import useThemeModes from 'hooks/useThemeModes';
import PropertyTypes from 'enums/PropertyTypes';
export const ThemeModeIcon = ({ title = '' }) => React.createElement("div", { className: "themem-mode-list", "data-toggle": "dropdown", title: title },
    React.createElement("span", { className: "tmicon tmicon-sun" }),
    React.createElement("span", { className: "tmicon tmicon-moon" }));
const ThemeModes = ({ property = null, useThemeHandler = null }) => {
    const { themeModes } = useThemeModes();
    const { type, themeMode } = property;
    let title = 'Change a theme mode';
    const selectHandler = (mode) => (e) => {
        useThemeHandler(mode);
    };
    const ThemeModeItems = themeModes.map((mode) => {
        let selected = false;
        if ((!themeMode && mode.isDefault) || themeMode === mode.id) {
            selected = true;
            title = mode.name;
        }
        return React.createElement("li", { key: `mode-id-${mode.id}`, className: selected ? 'mode-item selected' : 'mode-item' },
            React.createElement("a", { href: "#", onClick: selectHandler(mode) },
                mode.name,
                mode.isDefault ? ' (Default)' : ''));
    });
    return themeModes.length > 1 && (type === PropertyTypes.OPACITY || type === PropertyTypes.FILL_COLOR || type === PropertyTypes.STROKE_FILL) ? React.createElement("div", { className: "dropdown" },
        React.createElement(ThemeModeIcon, { title: title }),
        React.createElement("ul", { className: "dropdown-menu dropdown-menu-multi-select pull-right" }, ThemeModeItems)) : null;
};
export default ThemeModes;
