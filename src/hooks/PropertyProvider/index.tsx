import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Property from 'model/Property';

const initialProperties: Array<Property> = [];
const initialPropertiesSetter = {
  setProperties: null
};
const propertiesContext = React.createContext(initialProperties);
const propertiesSetterContext = React.createContext(initialPropertiesSetter);
const PropertyProvider = ({ value = initialProperties, children }) => {
  const [ properties, setProperties ] = useState(value);
  const propertiesSetterRef = useRef({
    setProperties
  });
  return (
    <propertiesContext.Provider value={properties}>
      <propertiesSetterContext.Provider value={propertiesSetterRef.current}>
        {children}
      </propertiesSetterContext.Provider>
    </propertiesContext.Provider>
  );
};

PropertyProvider.propTypes = {
  value: PropTypes.array,
};

PropertyProvider.displayName = "PropertyProvider";

export default PropertyProvider;
export { propertiesContext, propertiesSetterContext };
