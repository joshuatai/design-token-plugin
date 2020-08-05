import Color from 'color';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
import FillType from 'enums/FillTypes';
import fontLoader from 'utils/fontLoader';

export default (properties) => {
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
      if (property.fillType === FillType.SOLID) {
        color = Color(`#${property.color}`).alpha(property.opacity);
        calc["background"] = color;
        // if (color.isLight()) hostData.$element.addClass("hasLight");
      }
    }
    if (property.type === PropertyTypes.STROKE_FILL) {
      if (property.fillType === FillType.SOLID) {
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
