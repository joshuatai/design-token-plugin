import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import ThemeMode from 'model/ThemeMode';

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
  const [ themeModes, setThemeModes ] = useState(value);
  const [ themeModesMap, setThemeModesMap ] = useState(initialThemeModesMap);
  const themeModesSetterRef = useRef({
    setThemeModes
  });
  const themeModesMapSetterRef = useRef({
    setThemeModesMap
  });

  return (
    <ThemeModesContext.Provider value={themeModes}>
      <ThemeModesSetterContext.Provider value={themeModesSetterRef.current}>
        <ThemeModesMapContext.Provider value={themeModesMap}>
          <ThemeModesMapSetterContext.Provider value={themeModesMapSetterRef.current}>
            {children}
          </ThemeModesMapSetterContext.Provider>
        </ThemeModesMapContext.Provider>
      </ThemeModesSetterContext.Provider>
    </ThemeModesContext.Provider>
  );
};

ThemeModesProvider.propTypes = {
  value: PropTypes.array,
};

ThemeModesProvider.displayName = "ThemeModesProvider";

export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext, ThemeModesMapContext, ThemeModesMapSetterContext };
