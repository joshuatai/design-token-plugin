import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Tabs from 'enums/Tabs';

const initialTab: Tabs = Tabs.TOKENS;
const initialTabSetter = {
  setTab: null
};
const tabContext = React.createContext(initialTab);
const tabSetterContext = React.createContext(initialTabSetter);
const TabProvider = ({ value = initialTab, children }) => {
  const [ tab, setTab ] = useState(value);
  const tabSetterRef = useRef({
    setTab
  });

  return (
    <tabContext.Provider value={tab}>
      <tabSetterContext.Provider value={tabSetterRef.current}>
        {children}
      </tabSetterContext.Provider>
    </tabContext.Provider>
  );
};

TabProvider.propTypes = {
  value: PropTypes.string,
};

TabProvider.displayName = "TabProvider";

export default TabProvider;
export { tabContext, tabSetterContext };
