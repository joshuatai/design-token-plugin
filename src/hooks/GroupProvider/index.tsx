import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Group from 'model/Group';

const initialGroups: Array<Group> = [];
const initialGroupsSetter = {
  setGroups: null
};
const groupsContext = React.createContext(initialGroups);
const groupsSetterContext = React.createContext(initialGroupsSetter);
const GroupProvider = ({ value = initialGroups, children }) => {
  const [ groups, setGroups ] = useState(value);
  const groupsSetterRef = useRef({
    setGroups
  });
  return (
    <groupsContext.Provider value={groups}>
      <groupsSetterContext.Provider value={groupsSetterRef.current}>
        {children}
      </groupsSetterContext.Provider>
    </groupsContext.Provider>
  );
};
GroupProvider.propTypes = {
  value: PropTypes.array,
};
GroupProvider.displayName = "GroupProvider";

export default GroupProvider;
export { groupsContext, groupsSetterContext };
