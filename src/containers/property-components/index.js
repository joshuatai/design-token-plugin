import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import FillColor from './FillColor';
import StrokeWidthAlign from './StrokeWidthAlign';
import Opacity from './Opacity';
import FamilyStyle from './FontFamilyStyle';
import Spacing from './Spacing';
$(document).on("shown.bs.dropdown hidden.bs.dropdown", ".input-group-btn, .dropdown", function (event) {
    const $this = $(this);
    const container = $this.closest(".val-container");
    const dropdownMenu = container.find(".dropdown-menu");
    const input = container.find('[contenteditable]:visible');
    let value = $(".dropdown-toggle span", container).text();
    if (!value)
        value = input.text();
    if (event.type === "shown") {
        container.addClass("focus");
        dropdownMenu.scrollTop(0);
        const matchedOptions = dropdownMenu.find(`a:contains(${value})`);
        const exactlyMatched = Array.from(matchedOptions).filter(option => option.innerText === value);
        const targetOption = exactlyMatched.length > 0 ? exactlyMatched[0] : matchedOptions[0];
        if (targetOption) {
            $(targetOption).trigger('focus');
            dropdownMenu.scrollTop($(targetOption).parent().data("index") * 28);
        }
    }
    else {
        if (input && input.is(":focus")) {
            return;
        }
        else {
            container.removeClass("focus");
        }
    }
});
export default {
    [PropertyTypes.CORNER_RADIUS]: CornerRadius,
    [PropertyTypes.FILL_COLOR]: FillColor,
    [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign,
    [PropertyTypes.STROKE_FILL]: FillColor,
    [PropertyTypes.OPACITY]: Opacity,
    [PropertyTypes.FONT_FAMILY_STYLE]: FamilyStyle,
    [PropertyTypes.SPACING]: Spacing
};
