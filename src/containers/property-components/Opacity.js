import validator from 'validator';
import OpacityModel from 'model/Opacity';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken } from 'model/DataManager';
import CommonSettings from './CommonSettings';
import PropertyIcon from './PropertyIcon';
let hostData;
const NAME = 'opacity';
export default function ($) {
    var Opacity = function (element, options) {
        const useToken = getToken(options.useToken);
        let opacityValue;
        hostData = this;
        this.options = new OpacityModel(options);
        this.$element = $(element).attr('property-component', NAME);
        this.$customVal = $('<div class="custom-val"></div>');
        this.$valContainer = $('<div class="val-container"></div>');
        this.$opacityValue = $('<span class="opacity-val"></span>').attr('contenteditable', !useToken);
        const commonSetting = CommonSettings(this);
        this.$token = commonSetting.$token;
        this.$themeMode = commonSetting.$themeMode;
        useToken ? opacityValue = useToken.name : opacityValue = `${this.options.opacity}%`;
        this.$element[this.$themeMode ? 'addClass' : 'removeClass']('hasThemeMode');
        this.$element
            .append(this.$customVal
            .append(this.$valContainer
            .append(this.$icon)
            .append(this.$opacityValue.text(opacityValue).attr('title', opacityValue).addClass(this.tokenList.length ? 'hasReferenceToken' : ''))
            .append(this.$themeMode)
            .append(this.$token)));
        $(document).trigger('property-preview', [this.options]);
    };
    Opacity.prototype.setIcon = function () {
        const newIcon = PropertyIcon([this.options]).$icon;
        this.$icon.replaceWith(newIcon);
        this.$icon = newIcon;
        if (this.options.useToken) {
            this.$icon.attr('disabled', true);
        }
        else {
            this.$icon.attr('disabled', false);
        }
    };
    Opacity.prototype.useToken = function (token) {
        this.options.opacity = token.properties[0].opacity;
        this.$opacityValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
    };
    Opacity.prototype.detachToken = function (token) {
        const usedProperty = token.properties[0];
        this.$opacityValue
            .text(`${usedProperty.opacity}%`)
            .attr('contenteditable', true)
            .removeAttr('title');
    };
    Opacity.prototype.destroy = function () {
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
                $this.data(NAME, (data = new Opacity(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Opacity;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .opacity-val[contenteditable="true"]`, function (event) {
        if (event.type === BrowserEvents.KEY_UP) {
            if (event.key === 'Enter')
                $('.btn-primary').trigger('focus');
            return;
        }
        const $this = $(this);
        const options = hostData.options;
        let value = $this.text();
        value = value.replace('%', '');
        if (!validator.isInt(value))
            value = options.opacity;
        value = Math.min(Math.max(0, value), 100);
        options.opacity = value;
        $this.text(`${value}%`);
        $(document).trigger('property-preview', [options]);
    });
    return NAME;
}
(jQuery);
