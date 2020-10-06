import React, { useEffect, useRef, useContext } from "react";
import useAPI from 'hooks/useAPI';
import { ThemeModesContext } from 'hooks/ThemeModeProvider';
import useThemeModes from 'hooks/useThemeModes';
import SelectText from 'utils/SelectText';
import preventEvent from 'utils/preventEvent';
import { inputCheck, valChange } from 'utils/inputValidator';
import InputStatus from 'enums/InputStatus';
SelectText(jQuery);
const ThemeModeItem = ({ data, creatable }) => {
    const modeName = useRef(null);
    const { api: { admin } } = useAPI();
    const { getThemeMode, setThemeMode, removeThemeMode } = useThemeModes();
    const removeHandler = (e) => {
        if (!data.isDefault)
            removeThemeMode(data);
        // updateCurrentThemeMode();
        // $modeCreator.attr('disabled', false);
    };
    const blurHandler = (e) => {
        const $name = modeName.current;
        creatable(false);
        valChange
            .call($name, data.name)
            .then(res => {
            if (res === InputStatus.VALID) {
                const ThemeMode = getThemeMode(data.id);
                ThemeMode.name = $name.textContent;
                setThemeMode(ThemeMode);
                creatable(true);
            }
        })
            .catch(res => {
            if (res === InputStatus.NO_CHANGE)
                creatable(true);
        });
    };
    const focusHandler = (e) => {
        if (!admin)
            return;
        $(modeName.current).selectText();
        preventEvent(e);
    };
    const inputHandler = (e) => {
        const $name = modeName.current;
        inputCheck.call($name, e);
    };
    useEffect(() => {
        const $name = modeName.current;
        if (admin && $name && !$name.innerHTML)
            $name.click();
    }, []);
    return React.createElement("li", { id: `mode-${data.id}`, "data-id": data.id },
        React.createElement("span", { ref: modeName, className: "theme-mode-name", "data-id": data.id, "prop-name": "name", "is-required": "true", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, data.name),
        admin && React.createElement("span", { className: "remove-mode", "data-disabled": data.isDefault, onClick: removeHandler },
            React.createElement("svg", { className: "svg", width: "12", height: "6", viewBox: "0 0 12 6", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("path", { d: "M11.5 3.5H.5v-1h11v1z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" }))));
};
const ThemeModeList = ({ creatable }) => {
    const themeModes = useContext(ThemeModesContext);
    return (React.createElement("ul", { id: "mode-list" }, themeModes.map(mode => React.createElement(ThemeModeItem, { key: mode.id, data: mode, creatable: creatable }))));
};
export default ThemeModeList;
