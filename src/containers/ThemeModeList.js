import React from "react";
import useThemeModes from 'hooks/useThemeModes';
const ThemeModeItem = ({ data }) => {
    const { getThemeMode, removeThemeMode } = useThemeModes();
    const removeHandler = (e) => {
        const item = e.target.closest('li');
        const removeDisabled = e.target.closest('.remove-mode').dataset['disabled'];
        const id = item.dataset['id'];
        const mode = getThemeMode(id);
        if (!removeDisabled)
            removeThemeMode(mode);
        // removeThemeMode(mode);
        // saveThemeMode();
        // Renderer.themeModes();
        // updateCurrentThemeMode();
        // $modeCreator.attr('disabled', false);
    };
    return React.createElement("li", { id: `mode-${data.id}`, "data-id": data.id },
        React.createElement("span", { className: "theme-mode-name", "prop-name": "name", "is-required": "true", contentEditable: "false", suppressContentEditableWarning: true }, data.name),
        React.createElement("span", { className: "remove-mode", "data-disabled": data.isDefault, onClick: removeHandler },
            React.createElement("svg", { className: "svg", width: "12", height: "6", viewBox: "0 0 12 6", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("path", { d: "M11.5 3.5H.5v-1h11v1z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" }))));
};
const ThemeModeList = () => {
    const { themeModes } = useThemeModes();
    return (React.createElement("ul", { id: "mode-list" }, themeModes.map(mode => React.createElement(ThemeModeItem, { key: mode.id, data: mode }))));
};
export default ThemeModeList;
