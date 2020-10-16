import { useContext } from 'react';
import { propertiesContext, propertiesSetterContext } from '../PropertyProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
const useProperties = () => {
    const { api } = useAPI();
    const { saveProperties } = useData();
    const properties = useContext(propertiesContext);
    const { setProperties } = useContext(propertiesSetterContext);
    const _getProperty = function (id) {
        return arguments.length ? properties.slice().find(_property => _property.id === id) : properties.slice();
    };
    const _removeProperty = (property) => {
        const nextProperties = properties.slice().filter(_property => _property.id != property.id);
        _setAllProperties(nextProperties);
        return nextProperties;
    };
    const _addProperties = (_properties) => {
        const nextProperties = properties.slice();
        const existIndex = _properties.map(_prop => nextProperties.findIndex(_property => _property.id === _prop.id));
        existIndex.forEach((existIndex, index) => {
            existIndex > -1 ? nextProperties.splice(existIndex, 1, _properties[index]) : nextProperties.push(_properties[index]);
        });
        _setAllProperties(nextProperties);
        return nextProperties;
    };
    const _setAllProperties = (properties = []) => {
        setProperties(properties);
    };
    return {
        properties,
        getProperty: _getProperty,
        removeProperty: _removeProperty,
        addProperties: _addProperties,
        setAllProperties: _setAllProperties
    };
};
export default useProperties;
