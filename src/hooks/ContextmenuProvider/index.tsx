import React, { useRef, useState } from "react";

const initContextmenu: HTMLElement = null;
const initContextmenuSetter = {
    setContextmenu: null
};
const contextmenuContext = React.createContext(initContextmenu);
const contextmenuSetterContext = React.createContext(initContextmenuSetter);
const ContextmenuProvider = ({ value = initContextmenu, children }) => {
  const [ contextmenu, setContextmenu ] = useState(value);
  const contextmenuSetterRef = useRef({
    setContextmenu
  });
  return (
    <contextmenuContext.Provider value={contextmenu}>
      <contextmenuSetterContext.Provider value={contextmenuSetterRef.current}>
        {children}
      </contextmenuSetterContext.Provider>
    </contextmenuContext.Provider>
  );
};

ContextmenuProvider.displayName = "ContextmenuProvider";

export default ContextmenuProvider;
export { contextmenuContext, contextmenuSetterContext };
