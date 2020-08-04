import BrowserEvents from 'enums/BrowserEvents';
import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import FillColor from './FillColor';
import StrokeWidthAlign from './StrokeWidthAlign';
import Opacity from './Opacity';
import Text from './Text';
$(document).on(`${BrowserEvents.FOCUSIN} ${BrowserEvents.FOCUSOUT}`, '.val-container [contenteditable="true"], .separator-vals [contenteditable="true"]', function (event) {
    const input = $(this);
    if (event.type === BrowserEvents.FOCUSIN)
        input['selectText']();
    input.closest('.val-container')[event.type === BrowserEvents.FOCUSIN ? 'addClass' : 'removeClass']('focus');
});
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
        const exactlyMatched = matchedOptions.filter((index, option) => option.innerText === value);
        const targetOption = exactlyMatched.length > 0 ? exactlyMatched[0] : matchedOptions[0];
        if (targetOption)
            dropdownMenu.scrollTop($(targetOption).parent().data("index") * 28);
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
$(document).on(BrowserEvents.CLICK, `#token-setting .token-item`, function (event) {
    const $this = $(this);
    const useToken = $this.data('token');
    const property = $this.parent().data('property');
    property.options.useToken = useToken.id;
    property.$detachToken.data('token', useToken).show();
    property.$tokenList
        .children()
        .removeClass('selected')
        .children()
        .filter((index, item) => item.innerText === useToken.name)
        .parent()
        .addClass('selected');
    property.useToken(useToken);
    $(document).trigger('property-preview', [property.options]);
});
$(document).on(BrowserEvents.CLICK, `#token-setting .detach-token`, function (event) {
    const { token, property } = $(this).data();
    property.options.useToken = '';
    property.$detachToken.removeData('token').hide();
    property.$tokenList.children().removeClass('selected');
    property.detachToken(token);
});
export default ($) => ({
    [PropertyTypes.CORNER_RADIUS]: CornerRadius($),
    [PropertyTypes.FILL_COLOR]: FillColor($),
    [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign($),
    [PropertyTypes.STROKE_FILL]: FillColor($),
    [PropertyTypes.OPACITY]: Opacity($),
    [PropertyTypes.TEXT]: Text($)
});
