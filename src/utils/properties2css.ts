import Color from 'color';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
import FillType from 'enums/FillTypes';

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
      calc["background"] = [];
      if (property.fillType === FillType.SOLID) {
        color = Color(`#${property.color}`).alpha(property.opacity);
        calc["background"].push(
          `linear-gradient(to bottom, ${color},  ${color})`
        );
        // if (color.isLight()) hostData.$element.addClass("hasLight");
      }
    }
    if (property.type === PropertyTypes.STROKE_FILL) {
      calc["border-color"] = [];
      if (property.fillType === FillType.SOLID) {
        color = Color(`#${property.color}`).alpha(property.opacity);
        calc["border-color"].push(color);
        calc["border-style"] = "solid";
      }
      // hostData.$element.removeClass("hasLight");
    }
    return calc;
  }, {});
  if (css.background && css.background.length > 0) {
    css.background.push(
      `url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A')`
    );
  }
  if (css["border-width"] && !css["border-color"]) {
    css["border-color"] = "rgb(0, 0, 0)";
    css["border-style"] = "solid";
  }
  return css;
};
