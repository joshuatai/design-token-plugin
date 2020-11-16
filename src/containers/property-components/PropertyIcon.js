import React from "react";
// import { getToken, getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import usePropertyInfo from 'hooks/usePropertyInfo';
import Properties from 'model/Properties';
import Icon from './Icon';
const PropertyIcon = ({ options, disabled = false, fromTokenList = false }) => {
    let _property;
    if (options.length === 1) {
        _property = new Properties[options[0].type](options[0]);
    }
    else if (options.length > 1) {
        _property = options.map(option => new Properties[option.type](option));
    }
    const { type, title, style } = usePropertyInfo(_property, fromTokenList);
    return React.createElement(Icon, { type: type, title: title, style: style, disabled: disabled }); // .attr('data-role', 'token-icon');
};
export default PropertyIcon;
