import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialThemeModes = [];
const initialThemeModesSetter = {
    setThemeModes: null
};
const initialThemeModesMap = {};
const initialThemeModesMapSetter = {
    setThemeModesMap: null
};
const ThemeModesContext = React.createContext(initialThemeModes);
const ThemeModesMapContext = React.createContext(initialThemeModesMap);
const ThemeModesSetterContext = React.createContext(initialThemeModesSetter);
const ThemeModesMapSetterContext = React.createContext(initialThemeModesMapSetter);
const ThemeModesProvider = ({ value = initialThemeModes, children }) => {
    const [themeModes, setThemeModes] = useState(value);
    const [themeModesMap, setThemeModesMap] = useState(initialThemeModesMap);
    const themeModesSetterRef = useRef({
        setThemeModes
    });
    const themeModesMapSetterRef = useRef({
        setThemeModesMap
    });
    return (React.createElement(ThemeModesContext.Provider, { value: themeModes },
        React.createElement(ThemeModesSetterContext.Provider, { value: themeModesSetterRef.current },
            React.createElement(ThemeModesMapContext.Provider, { value: themeModesMap },
                React.createElement(ThemeModesMapSetterContext.Provider, { value: themeModesMapSetterRef.current }, children)))));
};
ThemeModesProvider.propTypes = {
    value: PropTypes.array,
};
ThemeModesProvider.displayName = "ThemeModesProvider";
export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext, ThemeModesMapContext, ThemeModesMapSetterContext };
