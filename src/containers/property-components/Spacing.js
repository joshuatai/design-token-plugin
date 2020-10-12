import validator from 'validator';
import SpacingModel from 'model/Spacing';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken } from 'model/DataManager';
// import CommonSettings from './CommonSettings.tss';
let hostData;
const NAME = 'spacing';
export default function ($) {
    var Spacing = function (element, options) {
        const useToken = getToken(options.useToken);
        let spacingValue;
        hostData = this;
        this.options = new SpacingModel(options);
        this.$element = $(element).attr('property-component', NAME);
        this.$customVal = $('<div class="custom-val"></div>');
        this.$valContainer = $('<div class="val-container"></div>');
        this.$spacingValue = $('<span class="spacing-val"></span>').attr('contenteditable', !useToken);
        const commonSetting = { $token: null }; //CommonSettings(this);
        this.$token = commonSetting.$token;
        useToken ? spacingValue = useToken.name : spacingValue = this.options.value;
        this.$element
            .append(this.$customVal
            .append(this.$valContainer
            .append(this.$icon)
            .append(this.$spacingValue.text(spacingValue).attr('title', spacingValue).addClass(this.tokenList.length ? 'hasReferenceToken' : ''))
            .append(this.$token)));
        $(document).trigger('property-preview', [this.options]);
    };
    Spacing.prototype.useToken = function (token) {
        this.options.value = token.properties[0].value;
        this.$spacingValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
    };
    Spacing.prototype.detachToken = function (token) {
        const usedProperty = token.properties[0];
        this.$spacingValue
            .text(usedProperty.value)
            .attr('contenteditable', true)
            .removeAttr('title');
    };
    Spacing.prototype.destroy = function () {
        return this.$element.removeAttr('property-component').empty().removeData().hide();
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(NAME);
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data(NAME, (data = new Spacing(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Spacing;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .spacing-val[contenteditable="true"]`, function (event) {
        const $this = $(this);
        if (event.type === BrowserEvents.KEY_UP) {
            if (event.key === 'Enter')
                $('.btn-primary').trigger('focus');
            return;
        }
        const options = hostData.options;
        let value = $this.text();
        if (!validator.isInt(value))
            value = options.value;
        value = Math.max(0, value);
        options.value = value;
        $this.text(value);
        $(document).trigger('property-preview', [options]);
    });
    return NAME;
}
(jQuery);
