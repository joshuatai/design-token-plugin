import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialProperties = [];
const initialPropertiesSetter = {
    setProperties: null
};
const propertiesContext = React.createContext(initialProperties);
const propertiesSetterContext = React.createContext(initialPropertiesSetter);
const PropertyProvider = ({ value = initialProperties, children }) => {
    const [properties, setProperties] = useState(value);
    const propertiesSetterRef = useRef({
        setProperties
    });
    return (React.createElement(propertiesContext.Provider, { value: properties },
        React.createElement(propertiesSetterContext.Provider, { value: propertiesSetterRef.current }, children)));
};
PropertyProvider.propTypes = {
    value: PropTypes.array,
};
PropertyProvider.displayName = "PropertyProvider";
export default PropertyProvider;
export { propertiesContext, propertiesSetterContext };
