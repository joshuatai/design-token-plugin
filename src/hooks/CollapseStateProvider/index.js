import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialCollapse = [];
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
    return (React.createElement(collapseContext.Provider, { value: collapse },
        React.createElement(collapseSetterContext.Provider, { value: collapseSetterRef.current }, children)));
};
CollapseStateProvider.propTypes = {
    value: PropTypes.array,
};
CollapseStateProvider.displayName = "CollapseStateProvider";
export default GroupProvider;
export { collapseContext, collapseSetterContext };
