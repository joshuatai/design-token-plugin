import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

export type T_PropertySetting = {
  id,
  parent
}
const initialProperty: T_PropertySetting = null;
const initialPropertySetter = {
  setProperty: null
};
const initialProperties: Array<T_PropertySetting> = [];
const initialPropertiesSetter = {
  setProperties: null
};
const propertyContext = React.createContext(initialProperty);
const propertySetterContext = React.createContext(initialPropertySetter);

const propertiesContext = React.createContext(initialProperties);
const propertiesSetterContext = React.createContext(initialPropertiesSetter);
const PropertySettingProvider = ({ value = initialProperties, children }) => {
  const [ property, setProperty ] = useState(initialProperty);
  const [ properties, setProperties ] = useState(value);
  const propertySetterRef = useRef({
    setProperty
  });
  const propertiesSetterRef = useRef({
    setProperties
  });
  
  return (
    <propertiesContext.Provider value={properties}>
      <propertiesSetterContext.Provider value={propertiesSetterRef.current}>
        <propertyContext.Provider value={property}>
          <propertySetterContext.Provider value={propertySetterRef.current}>
          {children}
          </propertySetterContext.Provider>
        </propertyContext.Provider>
      </propertiesSetterContext.Provider>
    </propertiesContext.Provider>
  );
};

PropertySettingProvider.propTypes = {
  value: PropTypes.object
};
PropertySettingProvider.displayName = "PropertySettingProvider";

export default PropertySettingProvider;
export { propertyContext, propertySetterContext, propertiesContext, propertiesSetterContext };
