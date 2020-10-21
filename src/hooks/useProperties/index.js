import { useContext } from 'react';
import { propertiesContext, propertiesSetterContext } from '../PropertyProvider';
import useAPI from 'hooks/useAPI';
import useTokens from 'hooks/useTokens';
const useProperties = () => {
    const { api } = useAPI();
    const { getToken } = useTokens();
    const properties = useContext(propertiesContext);
    const { setProperties } = useContext(propertiesSetterContext);
    const _referedTokens = (id) => properties
        .filter(property => property.useToken === id)
        .map((property) => property.parent)
        .filter((tokenId, index, tokens) => tokens.indexOf(tokenId) === index)
        .map(token => getToken(token));
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
        referedTokens: _referedTokens,
        getProperty: _getProperty,
        removeProperty: _removeProperty,
        addProperties: _addProperties,
        setAllProperties: _setAllProperties
    };
};
export default useProperties;
