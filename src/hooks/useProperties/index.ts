import { useContext } from 'react';
import { propertiesContext, propertiesSetterContext } from '../PropertyProvider';
import useAPI from 'hooks/useAPI';
import useTokens from 'hooks/useTokens';
import Property from 'model/Property';

const useProperties = () => {
  const { api } = useAPI();
  const { getToken } = useTokens();
  const properties: Array<Property> = useContext(propertiesContext);
  const { setProperties } = useContext(propertiesSetterContext);
  
  const _referedTokens = (id: string) => 
    properties
      .filter(property => property.useToken === id)
      .map((property: Property) => property.parent)
      .filter((tokenId: string, index: number, tokens: string[]) => tokens.indexOf(tokenId) === index)
      .map(token => getToken(token));
  
  const _getProperty = function (id?: string): Property | Array<Property> {
    return arguments.length ? properties.slice().find(_property => _property.id === id) : properties.slice();
  };
  const _removeProperty = (property: Property) => {
    const nextProperties = properties.slice().filter(_property => _property.id != property.id);
    _setAllProperties(nextProperties);
    return nextProperties;
  }
  const _addProperties = (_properties: Array<Property>) => {
    const nextProperties = properties.slice();
    const existIndex = _properties.map(_prop => nextProperties.findIndex(_property => _property.id === _prop.id));
    existIndex.forEach((existIndex, index) => {
      existIndex > -1 ? nextProperties.splice(existIndex, 1, _properties[index]) : nextProperties.push(_properties[index]);
    });
    _setAllProperties(nextProperties);
    return nextProperties;
  }
  const _setAllProperties = (properties: Array<Property> = []) => {
    setProperties(properties);
  }
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