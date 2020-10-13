import { useContext, useRef } from 'react';
import { propertyContext, propertySetterContext, propertiesContext, propertiesSetterContext } from '../PropertySettingProvider';
import useAPI from 'hooks/useAPI';
import Property from 'model/Property';

const usePropertySetting = () => {
  const { api } = useAPI();
  const property: Property = useContext(propertyContext);
  const properties: Array<Property> = useContext(propertiesContext);
  const { setProperty } = useContext(propertySetterContext);
  const { setProperties } = useContext(propertiesSetterContext);
  
  const _createProperty = () => {
    const _properties = properties.slice();
    const existIndex = _properties.findIndex((_property) => _property.id === property.id);
    if (existIndex > -1) {
      _properties.splice(existIndex, 1, property);
    } else {
      _properties.push(property);
    }
    setProperties(_properties);
  }
  const _setProperties = (_properties = []) => {
    setProperties(_properties);
  }

  return {
    propertySetting: property,
    propertiesSetting: properties,
    setPropertySetting: setProperty,
    setPropertiesSetting: _setProperties,
    createPropertySetting: _createProperty
  };
};

export default usePropertySetting;