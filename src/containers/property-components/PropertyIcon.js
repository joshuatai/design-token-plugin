import React from "react";
import _cloneDeep from 'lodash/cloneDeep';
// import { getToken, getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import usePropertyInfo from 'hooks/usePropertyInfo';
import Icon from './Icon';
const PropertyIcon = ({ options, fromTokenList = false }) => {
    const _property = options.length === 1 ? _cloneDeep(options[0]) : _cloneDeep(options);
    const { type, title } = usePropertyInfo(_property, fromTokenList);
    return React.createElement(Icon, { type: type, title: title }); // .attr('data-role', 'token-icon');
};
export default PropertyIcon;
