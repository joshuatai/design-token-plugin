import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import ThemeMode from 'model/ThemeMode';

const initialDefaultMode: ThemeMode = null;
const initialDefaultModeSetter = {
  setDefaultMode: null
};
const currentPageMode: ThemeMode = null;
const currentPageModeSetter = {
  setCurrentMode: null
};
const initialThemeModes: Array<ThemeMode> = [];
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
  const [ themeModes, setThemeModes ] = useState(value);
  const [ defaultMode, setDefaultMode ] = useState(initialDefaultMode);
  const [ currentMode, setCurrentMode ] = useState(currentPageMode);
  const themeModesSetterRef = useRef({
    setThemeModes
  });
  const defaultModeSetterRef = useRef({
    setDefaultMode
  });
  const currentModeSetterRef = useRef({
    setCurrentMode
  });
  return (
    <ThemeModesContext.Provider value={themeModes}>
      <ThemeModesSetterContext.Provider value={themeModesSetterRef.current}>
        <defaultModeContext.Provider value={defaultMode}>
          <defaultModeContextSetterContext.Provider value={defaultModeSetterRef.current}>
            <currentModeContext.Provider value={currentMode}>
              <currentModeSetterContext.Provider value={currentModeSetterRef.current}>
                {children}
              </currentModeSetterContext.Provider>
            </currentModeContext.Provider>
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
export { ThemeModesContext, ThemeModesSetterContext, defaultModeContext, defaultModeContextSetterContext, currentModeContext, currentModeSetterContext };
