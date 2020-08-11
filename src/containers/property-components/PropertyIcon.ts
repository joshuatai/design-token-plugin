import Color from 'color';
import _cloneDeep from 'lodash/cloneDeep';
import { getToken, getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';

const icons = {
  [PropertyTypes.CORNER_RADIUS]: '<span class="corner-radius-icon"></span>',
  [PropertyTypes.STROKE_WIDTH_ALIGN]: '<span class="stroke-width-icon"></span>',
  [PropertyTypes.STROKE_FILL]: '<div class="stroke-fill-icon"></div>',
  [PropertyTypes.FILL_COLOR]: '<div class="fill-color-icon"><div class="color-icon-opacity"></div></div>',
  [PropertyTypes.OPACITY]: '<div class="opacity-icon color-icon-opacity"></div>',
  [PropertyTypes.TEXT]: '<div class="font-size-icon">A</div>',
}
const opacityBg = `url("data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A")`;

export default (options, isCalc = false) => {
  const themeModes = getThemeMode();
  const defaultMode = themeModes.filter(mode => mode.isDefault === true)[0];
  let property;
  let css;
  let value;
  let title;
  let secondValue;
  let thridValue;

  const $icon = $(icons[options[0].type]);

  property = options.length === 1 ? _cloneDeep(options[0]) : _cloneDeep(options);

  if (isCalc && property instanceof Array) {
    const currentThemeMode = getCurrentThemeMode();
    const currentThemeProperty = property.filter(prop => prop.themeMode === currentThemeMode);
    if (currentThemeProperty.length > 0) {
      property = currentThemeProperty[0]
    } else {
      property = property.filter(prop => prop.themeMode = defaultMode.id)[0];
    }
  }
  if (property.type === PropertyTypes.FILL_COLOR) {
    value = property.color;
    secondValue = `${Math.floor(property.opacity * 100)}%`;
    if (themeModes.length > 1) thridValue = getThemeMode(property.themeMode).name;
    title = `Fill Color: #${value.toUpperCase()}`;    
    const color = Color(`#${value}`);
    $icon
      .addClass('token-icon')
      .css({
        background: color,
        borderColor: color.isLight() ? '#dddddd' : '#FFFFFF'
      })
      .children()
      .css("opacity", (100 - Math.floor(property.opacity * 100)) / 100);
  }
  if (property.type === PropertyTypes.STROKE_FILL) {
    value = property.color;
    secondValue = `${property.opacity * 100}%`;
    if (themeModes.length > 1) thridValue = getThemeMode(property.themeMode).name;
    title = `Stroke Color: #${value.toUpperCase()}`;
    const color = Color(`#${value}`).alpha(property.opacity);
    css = `linear-gradient(${color}, ${color}), ${opacityBg}`;
    $icon
      .addClass('token-icon')
      .css({
        background: css,
        borderColor: color.isLight() ? '#dddddd' : '#FFFFFF'
      });
  }
  
  if (property.type === PropertyTypes.CORNER_RADIUS) {
    if (typeof property.radius === 'symbol') {
      value = 'Mixed';
      title = `top-left: ${property.topLeft}; top-right: ${property.topRight}; bottom-right: ${property.bottomRight}; bottom-left: ${property.bottomLeft};`;
    } else {
      value = property.radius;
      title = `Corner Radius: ${value}`;
    }
  }
  if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
    value = property.width;
    secondValue = property.align;
    title = `Stroke Width: ${value} and Stroke Align: ${secondValue}`;
  }
  if (property.type === PropertyTypes.OPACITY) {
    value = `${property.opacity}%`;
    title = `Opacity: ${value}`; 
  }
  if (property.type === PropertyTypes.TEXT) {
    value = property.fontName.family;
    secondValue = property.fontSize;
    title = `Font Family: ${property.fontName.family}, Font Size: ${property.fontSize}`;
  }
  if (property.useToken) {
    let tokenName = getToken(property.useToken).name;
    value = tokenName;
    title = `Token: ${tokenName}`;
  }

  $icon.attr('title', title);

  return {
    value,
    title,
    secondValue,
    thridValue,
    $icon
  };
};
