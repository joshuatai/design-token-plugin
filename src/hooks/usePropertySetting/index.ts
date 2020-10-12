import { useContext, useRef } from 'react';
import { propertyContext, propertySetterContext, propertiesContext, propertiesSetterContext, T_PropertySetting } from '../PropertySettingProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import Token from 'model/Token';
import Group from 'model/Group';

const usePropertySetting = () => {
  const { api } = useAPI();
  const property: T_PropertySetting = useContext(propertyContext);
  const properties: Array<T_PropertySetting> = useContext(propertiesContext);
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
  return {
    property,
    properties,
    setProperty,
    createProperty: _createProperty
  };
};

export default usePropertySetting;