import BrowserEvents from 'enums/BrowserEvents';
import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import FillColor from './FillColor';
import StrokeWidthAlign from './StrokeWidthAlign';
import Opacity from './Opacity';
import Font from './Font';
import Spacing from './Spacing';

$(document).on(
  "shown.bs.dropdown hidden.bs.dropdown",
  ".input-group-btn, .dropdown",
  function (event) {
    // const $this = $(this);
    // const container = $this.closest(".val-container");
    // const dropdownMenu = container.find(".dropdown-menu");
    // const input = container.find('[contenteditable]:visible');
    // let value = $(".dropdown-toggle span", container).text();
    // if (!value) value = input.text();
    // if (event.type === "shown") {
    //   container.addClass("focus");
    //   dropdownMenu.scrollTop(0);
    //   const matchedOptions = dropdownMenu.find(`a:contains(${value})`);
    //   const exactlyMatched = matchedOptions.filter((index, option) => option.innerText === value);
    //   const targetOption = exactlyMatched.length > 0 ? exactlyMatched[0] : matchedOptions[0];
    //   if (targetOption) dropdownMenu.scrollTop($(targetOption).parent().data("index") * 28);
    // } else {
    //   if (input && input.is(":focus")) {
    //     return;
    //   } else {
    //     container.removeClass("focus");
    //   }
    // }
  }
);
// $(document).on(BrowserEvents.CLICK, '#token-setting .mode-item', function (event) {
//   if (propertyComponent) propertyComponent.setIcon();
// });

export default {
  [PropertyTypes.CORNER_RADIUS]: CornerRadius,
  [PropertyTypes.FILL_COLOR]: FillColor,
  [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign,
  [PropertyTypes.STROKE_FILL]: FillColor,
  [PropertyTypes.OPACITY]: Opacity,
  [PropertyTypes.FONT]: Font,
  [PropertyTypes.SPACING]: Spacing
};