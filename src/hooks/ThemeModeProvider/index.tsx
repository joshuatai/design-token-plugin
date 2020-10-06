import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import ThemeMode from 'model/ThemeMode';

const initialThemeModes: Array<ThemeMode> = [];
const initialThemeModesSetter = {
  setThemeModes: null
};
const ThemeModesContext = React.createContext(initialThemeModes);
const ThemeModesSetterContext = React.createContext(initialThemeModesSetter);
const ThemeModesProvider = ({ value = initialThemeModes, children }) => {
  const [ themeModes, setThemeModes ] = useState(value);
  const themeModesSetterRef = useRef({
    setThemeModes
  });
  return (
    <ThemeModesContext.Provider value={themeModes}>
      <ThemeModesSetterContext.Provider value={themeModesSetterRef.current}>
        {children}
      </ThemeModesSetterContext.Provider>
    </ThemeModesContext.Provider>
  );
};

ThemeModesProvider.propTypes = {
  value: PropTypes.array,
};

ThemeModesProvider.displayName = "ThemeModesProvider";

export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext };
