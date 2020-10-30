import Color from 'color';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from 'hooks/useTokens';
import ThemeMode from 'model/ThemeMode';
import Token from 'model/Token';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
import useProperties from 'hooks/useProperties';
import Property from 'model/Property';

const useTraversingUsedToken = () => {
  const { defaultMode } = useThemeModes();
  const { getToken } = useTokens();
  const { getProperty, properties } = useProperties();
  const traversing = (token, applyMode) => {
    // const useThemeMode = formTokenList ? getCurrentThemeMode() : applyModes;
    const useThemeMode: ThemeMode = applyMode;
    const existCurrentModePropId: string = token.properties.find(id => (getProperty(id) as Property).themeMode === useThemeMode.id);
    const defaultModePropId: string = token.properties.find(id => (getProperty(id) as Property).themeMode === defaultMode.id);
    const property: Property = existCurrentModePropId ? getProperty(existCurrentModePropId) as Property : getProperty(defaultModePropId) as Property;
    if (property.useToken) {
      return traversing(getToken(property.useToken), useThemeMode);
    } else {
      return property;
    }
  }
  return {
    traversing
  }
}

const usePropertyInfo = (property, fromTokenList = false) => {
  const { themeModes, defaultMode, currentMode, getThemeMode } = useThemeModes();
  const { traversing } = useTraversingUsedToken();
  const { getToken } = useTokens();
  let style, value, title, secondValue, thridValue;
  
  value = title = secondValue = thridValue = '';
  style = {};

  if (fromTokenList && property instanceof Array) {
    const currentThemeMode = currentMode || defaultMode;
    const currentThemeProperties = property.filter(prop => prop.themeMode === currentThemeMode.id);
    const defaultThmeeProperties = property.filter(prop => prop.themeMode = defaultMode.id);
    if (currentThemeProperties.length > 0) {
      property = currentThemeProperties.pop();
    } else {
      property = defaultThmeeProperties.pop();
    }
  }

  
//   if (property.type === PropertyTypes.STROKE_FILL) {
//     const isUseToken = property.useToken;
//     $icon.addClass('token-icon');
//     if (themeModes.length > 1) {
//       applyThemeMode = property.themeMode;
//       thridValue = getThemeMode(applyThemeMode).name;
//     }
//     value = property.color;
//     secondValue = `${Math.floor(property.opacity * 100)}%`;

//     if (isUseToken) {
//       const useToken = getToken(property.useToken);
//       value = useToken.name;
//       secondValue = '';
//       property = traversingUseToken(useToken);
//     }

//     title = `Stroke Color: #${property.color.toUpperCase()}`;
//     const color = Color(`#${property.color}`).alpha(property.opacity);
//     css = `linear-gradient(${color}, ${color}), ${opacityBg}`;
//     $icon
//       .addClass('token-icon')
//       .css({
//         background: css,
//         borderColor: color.isLight() ? '#dddddd' : '#FFFFFF'
//       });
//   }
    if (property.type === PropertyTypes.CORNER_RADIUS) {
      if (property.radius === Mixed) {
        value = 'Mixed';
        title = `top-left: ${property.topLeft}; top-right: ${property.topRight}; bottom-right: ${property.bottomRight}; bottom-left: ${property.bottomLeft};`;
      } else {
        value = property.radius;
        title = `Corner Radius: ${value}`;
      }
    }
//   if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
//     value = property.width;
//     secondValue = property.align;
//     title = `Stroke Width: ${value} and Stroke Align: ${secondValue}`;
//   }
    if (property.type === PropertyTypes.OPACITY) {
      const applyThemeMode: ThemeMode = getThemeMode(property.themeMode) as ThemeMode;
      if (themeModes.length > 1) {
        applyThemeMode ? thridValue = applyThemeMode.name : thridValue = defaultMode.name;
      }
      value = `${property.opacity}%`;
      if (property.useToken) {
        const useToken = getToken(property.useToken) as Token;
        value = useToken.name;
        secondValue = '';
        property = traversing(useToken, applyThemeMode);
      }
      title = `Opacity: ${property.opacity}%`;
    }
    if (property.type === PropertyTypes.FILL_COLOR) {
      const applyThemeMode: ThemeMode = getThemeMode(property.themeMode) as ThemeMode;
      if (themeModes.length > 1) {
        applyThemeMode ? thridValue = applyThemeMode.name : thridValue = defaultMode.name;
      }
      console.log(property);
      value = property.color;
      secondValue = `${property.opacity}%`;
      if (property.useToken) {
        const useToken = getToken(property.useToken) as Token;
        value = useToken.name;
        secondValue = '';
        property = traversing(useToken, applyThemeMode);
      }
          
      if (property.color === 'transparent') {
        title = `Fill Color: transparent`;
        style.background = 'transparent';
        style.opacity = 1;
        style.width = '14px';
      } else {
        title = `Fill Color: #${property.color.toUpperCase()}; Opacity: ${property.opacity}%;`;
        const color = Color(`#${property.color}`);
        style.background = color;
        style.borderColor = color.isLight() ? '#dddddd' : '#FFFFFF';
        style.opacity = (100 - property.opacity) / 100;
      }
    }
//   if (property.type === PropertyTypes.FONT) {
//     value = property.fontName.family;
//     secondValue = property.fontSize;
//     title = `Font Family: ${property.fontName.family}, Font Size: ${property.fontSize}`;
//   }
    if (property.type === PropertyTypes.SPACING) {
      value = property.value;
      title = `Spacing: ${value}`;
    }

    if (property.useToken) {
      let token = getToken(property.useToken) as Token;
      value = token.name;
    }

    return {
      type: property.type,
      value,
      title,
      secondValue,
      thridValue,
      style
    }
};

export default usePropertyInfo;
