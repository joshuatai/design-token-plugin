import { useContext } from 'react';
import useThemeModes from 'hooks/useThemeModes';
import ThemeMode from 'model/ThemeMode';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';

// function traversingUseToken (token) {
//   const themeModes = getThemeMode();
//   const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
//   const useThemeMode = formTokenList ? getCurrentThemeMode() : applyThemeMode;
//   const existCurrentMode = token.properties.find(prop => prop.themeMode === useThemeMode);
//   const defaultMode = token.properties.find(prop => prop.themeMode === defaultThemeMode);
//   const property = existCurrentMode ? existCurrentMode : defaultMode;
//   if (property.useToken) {
//     return traversingUseToken(getToken(property.useToken));
//   } else {
//     return property;
//   }
// }

const usePropertyInfo = (property, isCalc = false) => {
  const { themeModes, defaultMode, getThemeMode } = useThemeModes();
  let css, value, title, secondValue, thridValue, applyThemeMode;
  css = value = title = secondValue = thridValue = applyThemeMode = '';

  if (isCalc && property instanceof Array) {
    // const currentThemeMode = getCurrentThemeMode();
    // const currentThemeProperty = property.filter(prop => prop.themeMode === currentThemeMode);
    // if (currentThemeProperty.length > 0) {
    //   property = currentThemeProperty[0]
    // } else {
    //   property = property.filter(prop => prop.themeMode = defaultMode.id)[0];
    // }
  }

  if (property.type === PropertyTypes.FILL_COLOR) {
//     const isUseToken = property.useToken;
//     // $icon.addClass('token-icon');
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
    
//     if (property.color === 'transparent' || property.color === 'null') {
//       title = `Fill Color: transparent`;
//       $icon
//         .css('background', 'transparent')
//         .children()
//         .css({ opacity: 1, width: '14px' });
//     } else {
//       title = `Fill Color: #${property.color.toUpperCase()}; Opacity: ${Math.floor(property.opacity * 100)}%;`;
//       const color = Color(`#${property.color}`);
//       $icon
//         .css({
//           background: color,
//           borderColor: color.isLight() ? '#dddddd' : '#FFFFFF'
//         })
//         .children()
//         .css("opacity", (100 - Math.floor(property.opacity * 100)) / 100);
//     } 
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
      // const isUseToken = property.useToken;
      if (themeModes.length > 1) {
        applyThemeMode = property.themeMode;
        applyThemeMode ? thridValue = (getThemeMode(applyThemeMode) as ThemeMode).name : thridValue = defaultMode.name;
      }
      value = `${property.opacity}%`;
      // if (isUseToken) {
      //   const useToken = getToken(property.useToken);
      //   value = useToken.name;
      //   secondValue = '';
      //   property = traversingUseToken(useToken);
      // }
      title = `Opacity: ${property.opacity}%`;
    }
//   if (property.type === PropertyTypes.FONT) {
//     value = property.fontName.family;
//     secondValue = property.fontSize;
//     title = `Font Family: ${property.fontName.family}, Font Size: ${property.fontSize}`;
//   }
//   if (property.type === PropertyTypes.SPACING) {
//     value = property.value;
//     title = `Spacing: ${value}`;
//   }
    // if (property.useToken) {
    //   let tokenName = getToken(property.useToken).name;
    //   value = tokenName;
    // }

    return {
      value,
      title,
      secondValue,
      thridValue
    }
};

export default usePropertyInfo;
