import Color from 'color';
import { getThemeMode, getCurrentThemeMode, getToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
import FillType from 'enums/FillTypes';
import fontLoader from 'utils/fontLoader';

enum FontStyles {
  Light = 300,
  Regular = 'normal'
}

function traversingUseToken (token) {
  const themeModes = getThemeMode();
  const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
  const useThemeMode = getCurrentThemeMode();
  const existCurrentMode = token.properties.find(prop => prop.themeMode === useThemeMode);
  const defaultMode = token.properties.find(prop => prop.themeMode === defaultThemeMode);
  const property = existCurrentMode ? existCurrentMode : defaultMode;
  if (property.useToken) {
    return traversingUseToken(getToken(property.useToken));
  } else {
    return property;
  }
}

export default (properties) => {
  const themeModes = getThemeMode();
  const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
  const currentThemeMode = getCurrentThemeMode();
  const existCurrentMode = {};
  properties.forEach(prop => {
    if (prop.themeMode === currentThemeMode) {
      existCurrentMode[prop.type] = prop;
    }
  });
  let color;
  const css = properties.reduce((calc, property) => {
    if (property.type === PropertyTypes.CORNER_RADIUS) {
      calc["border-top-left-radius"] = property.topLeft;
      calc["border-top-right-radius"] = property.topRight;
      calc["border-bottom-right-radius"] = property.bottomRight;
      calc["border-bottom-left-radius"] = property.bottomLeft;
    }
    if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
      calc["border-width"] = `${property.width}px`;
      if (property.align === StrokeAligns.OUTSIDE)
        calc["box-sizing"] = "content-box";
    }
    if (property.type === PropertyTypes.FILL_COLOR) {
      if (((existCurrentMode[property.type] && property.themeMode === currentThemeMode) || (!existCurrentMode[property.type] && property.themeMode === defaultThemeMode)) && property.fillType === FillType.SOLID) {
        if (property.useToken) {
          property = traversingUseToken(getToken(property.useToken));
        }
        if (property.color === 'transparent' || property.color === 'null') {
          color = 'transparent';
        } else {
          color = Color(`#${property.color}`).alpha(property.opacity);
        }
        calc["background"] = color;
        // if (color.isLight()) hostData.$element.addClass("hasLight");
      }
    }
    if (property.type === PropertyTypes.STROKE_FILL) {
      if (((existCurrentMode[property.type] && property.themeMode === currentThemeMode) || (!existCurrentMode[property.type] && property.themeMode === defaultThemeMode)) && property.fillType === FillType.SOLID) {
        if (property.useToken) {
          property = traversingUseToken(getToken(property.useToken));
        }
        color = Color(`#${property.color}`).alpha(property.opacity);
        calc["border-color"] = color;
        calc["border-style"] = "solid";
      }
      // hostData.$element.removeClass("hasLight");
    }
    if (property.type === PropertyTypes.OPACITY) {
      if ((existCurrentMode[property.type] && property.themeMode === currentThemeMode) || (!existCurrentMode[property.type] && property.themeMode === defaultThemeMode)) {
        if (property.useToken) {
          property = traversingUseToken(getToken(property.useToken));
        }
        if (property.opacity < 100) {
          calc["opacity"] = property.opacity / 100;
        }
      }
    }
    if (property.type === PropertyTypes.TEXT) {
      calc["font-family"] = property.fontName.family;
      calc["font-size"] = property.fontSize;
      calc["font-weight"] = FontStyles[property.fontName.style];
      fontLoader(property.fontName.family);
    }
    return calc;
  }, {});
  if (css["border-width"] && !css["border-color"]) {
    css["border-color"] = "rgb(0, 0, 0)";
    css["border-style"] = "solid";
  }
  return css;
};
