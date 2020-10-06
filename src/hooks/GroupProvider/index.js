import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialGroups = [];
const initialGroupsSetter = {
    setGroups: null
};
const groupsContext = React.createContext(initialGroups);
const groupsSetterContext = React.createContext(initialGroupsSetter);
const GroupProvider = ({ value = initialGroups, children }) => {
    const [groups, setGroups] = useState(value);
    const groupsSetterRef = useRef({
        setGroups
    });
    return (React.createElement(groupsContext.Provider, { value: groups },
        React.createElement(groupsSetterContext.Provider, { value: groupsSetterRef.current }, children)));
};
GroupProvider.propTypes = {
    value: PropTypes.array,
};
GroupProvider.displayName = "GroupProvider";
export default GroupProvider;
export { groupsContext, groupsSetterContext };
