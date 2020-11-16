import React, { FC, ReactElement, useContext } from "react";
import Color from 'color';
import _cloneDeep from 'lodash/cloneDeep';
// import { getToken, getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import usePropertyInfo from 'hooks/usePropertyInfo';
import PropertyTypes from 'enums/PropertyTypes';
import Properties from 'model/Properties';
import Icon from './Icon';
import Property from "model/Property";

// const opacityBg = `url("data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A")`;
// export default (options, isCalc = false) => {   
//   formTokenList = isCalc;

//   if (isCalc && property instanceof Array) {
//     const currentThemeMode = getCurrentThemeMode();
//     const currentThemeProperty = property.filter(prop => prop.themeMode === currentThemeMode);
//     if (currentThemeProperty.length > 0) {
//       property = currentThemeProperty[0]
//     } else {
//       property = property.filter(prop => prop.themeMode = defaultMode.id)[0];
//     }
//   }
type T_PropertyIcon = {
  options: Array<Property>,
  disabled: boolean,
  fromTokenList: boolean
};
const PropertyIcon = ({
  options,
  disabled = false,
  fromTokenList = false
}) => {
  let _property;
  if (options.length === 1) {
    _property = new Properties[options[0].type](options[0]);
  } else if (options.length > 1) {
    _property = options.map(option => new Properties[option.type](option));
  }
  const { type, title, style } = usePropertyInfo(_property, fromTokenList);
  return <Icon type={type} title={title} style={style} disabled={disabled}></Icon> // .attr('data-role', 'token-icon');
}

export default PropertyIcon;
