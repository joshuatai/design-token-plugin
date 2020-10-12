import React from "react";
import useThemeModes from 'hooks/useThemeModes';
import PropertyTypes from 'enums/PropertyTypes';
export const ThemeModeIcon = ({ title = 'Change theme mode' }) => {
    return React.createElement("div", { className: "themem-mode-list", "data-toggle": "dropdown", title: title },
        React.createElement("span", { className: "tmicon tmicon-sun" }),
        React.createElement("span", { className: "tmicon tmicon-moon" }));
};
const ThemeModeItem = ({ mode, selected = false }) => {
    return React.createElement("li", { className: selected ? 'mode-item selected' : 'mode-item', "data-index": "${index}", "data-id": mode.id },
        React.createElement("a", { href: "#" },
            mode.name,
            mode.isDefault ? ' (Default)' : ''));
};
const ThemeModes = ({ property: { type, themeMode } }) => {
    const { themeModes } = useThemeModes();
    let title = '';
    const ThemeModeItems = themeModes.map(mode => {
        let selected = false;
        if ((!themeMode && mode.isDefault) || themeMode === mode.id) {
            selected = true;
            title = mode.name;
            //             options.themeMode = mode.id;
        }
        return React.createElement(ThemeModeItem, { key: mode.id, selected: selected, mode: mode });
    });
    return themeModes.length > 1 && (type === PropertyTypes.OPACITY || type === PropertyTypes.FILL_COLOR || type === PropertyTypes.STROKE_FILL) ? React.createElement("div", { className: "dropdown" },
        React.createElement(ThemeModeIcon, { title: title }),
        React.createElement("ul", { className: "dropdown-menu dropdown-menu-multi-select pull-right" }, ThemeModeItems)) : null;
};
export default ThemeModes;
