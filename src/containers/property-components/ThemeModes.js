import React from "react";
import useThemeModes from 'hooks/useThemeModes';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import PropertyTypes from 'enums/PropertyTypes';
export const ThemeModeIcon = ({ title = '' }) => React.createElement("div", { className: "themem-mode-list", "data-toggle": "dropdown", title: title },
    React.createElement("span", { className: "tmicon tmicon-sun" }),
    React.createElement("span", { className: "tmicon tmicon-moon" }));
const ThemeModes = ({ property = null, useThemeHandler = null }) => {
    const { themeModes, defaultMode } = useThemeModes();
    const { getToken } = useTokens();
    const { getProperty } = useProperties();
    const { type, themeMode } = property;
    let title = 'Change a theme mode';
    const selectHandler = (mode) => (e) => {
        e.target.closest('li').classList.contains('disabled') ? '' : useThemeHandler(mode);
    };
    const ThemeModeItems = themeModes.map((mode) => {
        let selected = false;
        let className = ['mode-item'];
        if ((!themeMode && mode.isDefault) || themeMode === mode.id) {
            selected = true;
            title = mode.name;
            className.push('selected');
        }
        if (property.useToken) {
            const availibleTheme = getToken(property.useToken).properties.find(propId => {
                const propertyTheme = getProperty(propId).themeMode;
                return propertyTheme === defaultMode.id || propertyTheme === mode.id;
            });
            if (!availibleTheme)
                className.push('disabled');
        }
        return React.createElement("li", { key: `mode-id-${mode.id}`, className: className.join(' ') },
            React.createElement("a", { href: "#", onClick: selectHandler(mode) },
                mode.name,
                mode.isDefault ? ' (Default)' : ''));
    });
    return themeModes.length > 1 && (type === PropertyTypes.OPACITY || type === PropertyTypes.FILL_COLOR || type === PropertyTypes.STROKE_FILL) ? React.createElement("div", { className: "dropdown" },
        React.createElement(ThemeModeIcon, { title: title }),
        React.createElement("ul", { className: "dropdown-menu dropdown-menu-multi-select pull-right" }, ThemeModeItems)) : null;
};
export default ThemeModes;
