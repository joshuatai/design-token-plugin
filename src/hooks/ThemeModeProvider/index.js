import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialDefaultMode = null;
const initialDefaultModeSetter = {
    setDefaultMode: null
};
const initialThemeModes = [];
const initialThemeModesSetter = {
    setThemeModes: null
};
const defaultModeContext = React.createContext(initialDefaultMode);
const defaultModeContextSetterContext = React.createContext(initialDefaultModeSetter);
const ThemeModesContext = React.createContext(initialThemeModes);
const ThemeModesSetterContext = React.createContext(initialThemeModesSetter);
const ThemeModesProvider = ({ value = initialThemeModes, children }) => {
    const [themeModes, setThemeModes] = useState(value);
    const [defaultMode, setDefaultMode] = useState(initialDefaultMode);
    const themeModesSetterRef = useRef({
        setThemeModes
    });
    const defaultModeSetterRef = useRef({
        setDefaultMode
    });
    return (React.createElement(ThemeModesContext.Provider, { value: themeModes },
        React.createElement(ThemeModesSetterContext.Provider, { value: themeModesSetterRef.current },
            React.createElement(defaultModeContext.Provider, { value: defaultMode },
                React.createElement(defaultModeContextSetterContext.Provider, { value: defaultModeSetterRef.current }, children)))));
};
ThemeModesProvider.propTypes = {
    value: PropTypes.array,
};
ThemeModesProvider.displayName = "ThemeModesProvider";
export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext, defaultModeContext, defaultModeContextSetterContext };
