import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Property from 'model/Property';

const initialProperty: Property = null;
const initialPropertySetter = {
  setProperty: null
};
const initialPropertyEdit: Property = null;
const initialPropertyEditSetter = {
  setPropertyEdit: null
};
const initialProperties: Array<Property> = [];
const initialPropertiesSetter = {
  setProperties: null
};
const propertyContext = React.createContext(initialProperty);
const propertySetterContext = React.createContext(initialPropertySetter);
const propertyEditContext = React.createContext(initialPropertyEdit);
const propertyEditSetterContext = React.createContext(initialPropertyEditSetter);
const propertiesContext = React.createContext(initialProperties);
const propertiesSetterContext = React.createContext(initialPropertiesSetter);
const PropertySettingProvider = ({ value = initialProperties, children }) => {
  const [ property, setProperty ] = useState(initialProperty);
  const [ propertyEdit, setPropertyEdit ] = useState(null);
  const [ properties, setProperties ] = useState(value);
  const propertySetterRef = useRef({
    setProperty
  });
  const propertyEditSetterRef = useRef({
    setPropertyEdit
  });
  const propertiesSetterRef = useRef({
    setProperties
  });
  
  return (
    <propertiesContext.Provider value={properties}>
      <propertiesSetterContext.Provider value={propertiesSetterRef.current}>
        <propertyContext.Provider value={property}>
          <propertySetterContext.Provider value={propertySetterRef.current}>
            <propertyEditContext.Provider value={propertyEdit}>
              <propertyEditSetterContext.Provider value={propertyEditSetterRef.current}>
                {children}
              </propertyEditSetterContext.Provider>
            </propertyEditContext.Provider>
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
export { propertyContext, propertySetterContext, propertyEditContext, propertyEditSetterContext, propertiesContext, propertiesSetterContext };
