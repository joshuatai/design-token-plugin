import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import ThemeMode from 'model/ThemeMode';

const initialDefaultMode: ThemeMode = null;
const initialDefaultModeSetter = {
  setDefaultMode: null
};
const initialThemeModes: Array<ThemeMode> = [];
const initialThemeModesSetter = {
  setThemeModes: null
};
const defaultModeContext = React.createContext(initialDefaultMode);
const defaultModeContextSetterContext = React.createContext(initialDefaultModeSetter);
const ThemeModesContext = React.createContext(initialThemeModes);
const ThemeModesSetterContext = React.createContext(initialThemeModesSetter);
const ThemeModesProvider = ({ value = initialThemeModes, children }) => {
  const [ themeModes, setThemeModes ] = useState(value);
  const [ defaultMode, setDefaultMode ] = useState(initialDefaultMode);
  const themeModesSetterRef = useRef({
    setThemeModes
  });
  const defaultModeSetterRef = useRef({
    setDefaultMode
  });
  return (
    <ThemeModesContext.Provider value={themeModes}>
      <ThemeModesSetterContext.Provider value={themeModesSetterRef.current}>
        <defaultModeContext.Provider value={defaultMode}>
          <defaultModeContextSetterContext.Provider value={defaultModeSetterRef.current}>
            {children}
          </defaultModeContextSetterContext.Provider>
        </defaultModeContext.Provider>
      </ThemeModesSetterContext.Provider>
    </ThemeModesContext.Provider>
  );
};

ThemeModesProvider.propTypes = {
  value: PropTypes.array,
};

ThemeModesProvider.displayName = "ThemeModesProvider";

export default ThemeModesProvider;
export { ThemeModesContext, ThemeModesSetterContext, defaultModeContext, defaultModeContextSetterContext };
