import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialThemeModes = [];
const initialThemeModesSetter = {
    setThemeModes: null
};
const ThemeModesContext = React.createContext(initialThemeModes);
const ThemeModesSetterContext = React.createContext(initialThemeModesSetter);
const ThemeModesProvider = ({ value = initialThemeModes, children }) => {
    const [themeModes, setThemeModes] = useState(value);
    const themeModesSetterRef = useRef({
        setThemeModes
    });
    return (React.createElement(ThemeModesContext.Provider, { value: themeModes },
        React.createElement(ThemeModesSetterContext.Provider, { value: themeModesSetterRef.current }, children)));
};
ThemeModesProvider.propTypes = {
    value: PropTypes.array,
};
ThemeModesProvider.displayName = "ThemeModesProvider";
export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext };
