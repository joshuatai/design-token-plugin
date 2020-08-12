import Color from 'color';
import { getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
import FillType from 'enums/FillTypes';
import fontLoader from 'utils/fontLoader';

enum FontStyles {
  Light = 300,
  Regular = 'normal'
}
export default (properties) => {
  const themeModes = getThemeMode();
  const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
  const currentThemeMode = getCurrentThemeMode();
  const existCurrentMode = properties.find(prop => prop.themeMode === currentThemeMode);
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
      if (((existCurrentMode && property.themeMode === currentThemeMode) || (!existCurrentMode && property.themeMode === defaultThemeMode)) && property.fillType === FillType.SOLID) {
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
      if (((existCurrentMode && property.themeMode === currentThemeMode) || (!existCurrentMode && property.themeMode === defaultThemeMode)) && property.fillType === FillType.SOLID) {
        color = Color(`#${property.color}`).alpha(property.opacity);
        calc["border-color"] = color;
        calc["border-style"] = "solid";
      }
      // hostData.$element.removeClass("hasLight");
    }
    if (property.type === PropertyTypes.OPACITY) {
      if (property.opacity < 100) {
        calc["opacity"] = property.opacity / 100;
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
