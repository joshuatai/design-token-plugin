import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialProperty = null;
const initialPropertySetter = {
    setProperty: null
};
const initialPropertyEdit = null;
const initialPropertyEditSetter = {
    setPropertyEdit: null
};
const initialProperties = [];
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
    const [property, setProperty] = useState(initialProperty);
    const [propertyEdit, setPropertyEdit] = useState(null);
    const [properties, setProperties] = useState(value);
    const propertySetterRef = useRef({
        setProperty
    });
    const propertyEditSetterRef = useRef({
        setPropertyEdit
    });
    const propertiesSetterRef = useRef({
        setProperties
    });
    return (React.createElement(propertiesContext.Provider, { value: properties },
        React.createElement(propertiesSetterContext.Provider, { value: propertiesSetterRef.current },
            React.createElement(propertyContext.Provider, { value: property },
                React.createElement(propertySetterContext.Provider, { value: propertySetterRef.current },
                    React.createElement(propertyEditContext.Provider, { value: propertyEdit },
                        React.createElement(propertyEditSetterContext.Provider, { value: propertyEditSetterRef.current }, children)))))));
};
PropertySettingProvider.propTypes = {
    value: PropTypes.object
};
PropertySettingProvider.displayName = "PropertySettingProvider";
export default PropertySettingProvider;
export { propertyContext, propertySetterContext, propertyEditContext, propertyEditSetterContext, propertiesContext, propertiesSetterContext };
