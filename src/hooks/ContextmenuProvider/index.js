import React, { useRef, useState } from "react";
const initContextmenu = null;
const initContextmenuSetter = {
    setContextmenu: null
};
const contextmenuContext = React.createContext(initContextmenu);
const contextmenuSetterContext = React.createContext(initContextmenuSetter);
const ContextmenuProvider = ({ value = initContextmenu, children }) => {
    const [contextmenu, setContextmenu] = useState(value);
    const contextmenuSetterRef = useRef({
        setContextmenu
    });
    return (React.createElement(contextmenuContext.Provider, { value: contextmenu },
        React.createElement(contextmenuSetterContext.Provider, { value: contextmenuSetterRef.current }, children)));
};
ContextmenuProvider.displayName = "ContextmenuProvider";
export default ContextmenuProvider;
export { contextmenuContext, contextmenuSetterContext };
