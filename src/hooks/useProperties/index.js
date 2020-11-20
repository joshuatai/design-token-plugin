import { useContext } from 'react';
import { propertiesContext, propertiesSetterContext } from '../PropertyProvider';
import { toSaveProperties } from 'hooks/useData';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from 'hooks/useTokens';
import { sendMessage } from 'model/DataManager';
import MessageTypes from 'enums/MessageTypes';
const useProperties = () => {
    const { defaultMode } = useThemeModes();
    const { getToken } = useTokens();
    const properties = useContext(propertiesContext);
    const { setProperties } = useContext(propertiesSetterContext);
    const _referedProperties = (id) => properties.filter(property => property.useToken === id);
    const _referedTokens = (id) => properties
        .filter(property => property.useToken === id)
        .map((property) => property.parent)
        .filter((tokenId, index, tokens) => tokens.indexOf(tokenId) === index)
        .map(token => getToken(token));
    const _getProperty = function (id) {
        return arguments.length ? properties.slice().find(_property => _property.id === id) : properties.slice();
    };
    const _getProperties = (_properties) => {
        return properties.filter(property => {
            return _properties.some(_propId => property.id === _propId);
        });
    };
    const _removeProperties = (_properties) => {
        const nextProperties = properties.slice().filter(_property => !_properties.some(_prop => _prop.id === _property.id));
        _setAllProperties(nextProperties);
        return nextProperties;
    };
    const _addProperties = (_properties) => {
        const relatedTokens = Object.keys(_properties.reduce((calc, prop) => (calc[prop.parent] = prop, calc), {}));
        let nextProperties = properties.slice();
        nextProperties = _removeProperties(relatedTokens.map(tokenId => {
            const existProps = nextProperties.filter(prop => prop.parent === tokenId);
            return existProps.filter(prop => !_properties.some(_prop => _prop.id === prop.id));
        }).flat());
        const existIndex = _properties.map(_prop => nextProperties.findIndex(_property => _property.id === _prop.id));
        existIndex.forEach((existIndex, index) => {
            existIndex > -1 ? nextProperties.splice(existIndex, 1, _properties[index]) : nextProperties.push(_properties[index]);
        });
        _setAllProperties(nextProperties);
        return nextProperties;
    };
    const _setAllProperties = (properties = []) => {
        setProperties(properties);
        sendMessage(MessageTypes.SET_PROPERTIES, toSaveProperties(properties));
    };
    const _traversing = (token, applyMode) => {
        const useThemeMode = applyMode ? applyMode : defaultMode;
        const existCurrentModePropId = token.properties.find(id => _getProperty(id).themeMode === useThemeMode.id);
        const defaultModePropId = token.properties.find(id => _getProperty(id).themeMode === defaultMode.id);
        const property = existCurrentModePropId ? _getProperty(existCurrentModePropId) : _getProperty(defaultModePropId);
        if (property.useToken) {
            return _traversing(getToken(property.useToken), useThemeMode);
        }
        else {
            return property;
        }
    };
    return {
        properties,
        referedProperties: _referedProperties,
        referedTokens: _referedTokens,
        getProperty: _getProperty,
        getProperties: _getProperties,
        removeProperties: _removeProperties,
        addProperties: _addProperties,
        setAllProperties: _setAllProperties,
        traversing: _traversing
    };
};
export default useProperties;
