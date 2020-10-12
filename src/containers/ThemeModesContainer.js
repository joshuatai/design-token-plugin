import React, { useState } from "react";
import useAPI from 'hooks/useAPI';
import useThemeModes from 'hooks/useThemeModes';
import ThemeModeList from './ThemeModeList';
import ThemeMode from 'model/ThemeMode';
const ThemeModesContainer = () => {
    const { api: { admin } } = useAPI();
    const { setThemeMode } = useThemeModes();
    const [createEnable, setCreateEnable] = useState(true);
    const createModeHandler = () => {
        const newMode = new ThemeMode({
            name: '',
            isDefault: false
        });
        setCreateEnable(false);
        setThemeMode(newMode);
    };
    return React.createElement("div", { id: "mode-setting", className: "plugin-panel" },
        React.createElement(ThemeModeList, { creatable: setCreateEnable }),
        admin && React.createElement("button", { id: "mode-creator", onClick: createModeHandler, disabled: !createEnable }, "Add a new theme mode"));
};
export default ThemeModesContainer;