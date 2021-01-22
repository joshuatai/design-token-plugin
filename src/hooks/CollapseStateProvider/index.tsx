import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

type Collapse = {
  id: string;
  collapse: true;
};
const initialCollapse: Array<Collapse> = [];
const initialCollapseSetter = {
  setCollapse: null,
};
const collapseContext = React.createContext(initialCollapse);
const collapseSetterContext = React.createContext(initialCollapseSetter);
const CollapseStateProvider = ({ value = initialCollapse, children }) => {
  const [collapse, setCollapse] = useState(value);
  const collapseSetterRef = useRef({
    setCollapse,
  });
  return (
    <collapseContext.Provider value={collapse}>
      <collapseSetterContext.Provider value={collapseSetterRef.current}>
        {children}
      </collapseSetterContext.Provider>
    </collapseContext.Provider>
  );
};
CollapseStateProvider.propTypes = {
  value: PropTypes.array,
};
CollapseStateProvider.displayName = "CollapseStateProvider";

export default CollapseStateProvider;
export { collapseContext, collapseSetterContext };
