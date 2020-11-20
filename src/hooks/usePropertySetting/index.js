import { useContext } from 'react';
import { propertyContext, propertySetterContext, propertiesContext, propertiesSetterContext, propertyEditContext, propertyEditSetterContext } from '../PropertySettingProvider';
const usePropertySetting = () => {
    const property = useContext(propertyContext);
    const propertyEdit = useContext(propertyEditContext);
    const properties = useContext(propertiesContext);
    const { setProperty } = useContext(propertySetterContext);
    const { setPropertyEdit } = useContext(propertyEditSetterContext);
    const { setProperties } = useContext(propertiesSetterContext);
    const _getPropertySetting = (id) => properties.find(property => property.id === id);
    const _setPropertyEdit = (property) => {
        property ? setPropertyEdit(property) : setPropertyEdit(null);
    };
    const _resetPropertySetting = (_property) => {
        const _properties = properties.slice();
        setProperties(_properties.filter(_prop => _prop.id !== _property.id));
    };
    const _createProperty = () => {
        const _properties = properties.slice();
        const existIndex = _properties.findIndex((_property) => _property.id === property.id);
        if (existIndex > -1) {
            _properties.splice(existIndex, 1, property);
        }
        else {
            _properties.push(property);
        }
        setProperties(_properties);
    };
    const _setProperties = (_properties = []) => {
        setProperties(_properties);
    };
    return {
        propertySetting: property,
        propertiesSetting: properties,
        propertyEdit,
        setPropertyEdit: _setPropertyEdit,
        getPropertySetting: _getPropertySetting,
        setPropertySetting: setProperty,
        setPropertiesSetting: _setProperties,
        resetPropertySetting: _resetPropertySetting,
        createPropertySetting: _createProperty
    };
};
export default usePropertySetting;
