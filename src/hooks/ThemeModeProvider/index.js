import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialDefaultMode = null;
const initialDefaultModeSetter = {
    setDefaultMode: null
};
const currentPageMode = null;
const currentPageModeSetter = {
    setCurrentMode: null
};
const initialThemeModes = [];
const initialThemeModesSetter = {
    setThemeModes: null
};
const currentModeContext = React.createContext(currentPageMode);
const currentModeSetterContext = React.createContext(currentPageModeSetter);
const defaultModeContext = React.createContext(initialDefaultMode);
const defaultModeContextSetterContext = React.createContext(initialDefaultModeSetter);
const ThemeModesContext = React.createContext(initialThemeModes);
const ThemeModesSetterContext = React.createContext(initialThemeModesSetter);
const ThemeModesProvider = ({ value = initialThemeModes, children }) => {
    const [themeModes, setThemeModes] = useState(value);
    const [defaultMode, setDefaultMode] = useState(initialDefaultMode);
    const [currentMode, setCurrentMode] = useState(currentPageMode);
    const themeModesSetterRef = useRef({
        setThemeModes
    });
    const defaultModeSetterRef = useRef({
        setDefaultMode
    });
    const currentModeSetterRef = useRef({
        setCurrentMode
    });
    return (React.createElement(ThemeModesContext.Provider, { value: themeModes },
        React.createElement(ThemeModesSetterContext.Provider, { value: themeModesSetterRef.current },
            React.createElement(defaultModeContext.Provider, { value: defaultMode },
                React.createElement(defaultModeContextSetterContext.Provider, { value: defaultModeSetterRef.current },
                    React.createElement(currentModeContext.Provider, { value: currentMode },
                        React.createElement(currentModeSetterContext.Provider, { value: currentModeSetterRef.current }, children)))))));
};
ThemeModesProvider.propTypes = {
    value: PropTypes.array,
};
ThemeModesProvider.displayName = "ThemeModesProvider";
export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext, defaultModeContext, defaultModeContextSetterContext, currentModeContext, currentModeSetterContext };
