import validator from 'validator';
import Color from 'color';
import { validateHTMLColorHex } from "validate-color";
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';
import StrokeFill from 'model/StrokeFill';
import colorPicker from 'utils/colorPicker';
// import PropertyIcon from './PropertyIcon';
// import CommonSettings from './CommonSettings.tss';
colorPicker(jQuery);
let $host;
let hostData;
const NAME = 'color';
function traversingUseToken(token) {
    const themeModes = getThemeMode();
    const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
    const useThemeMode = getCurrentThemeMode();
    const existCurrentMode = token.properties.find(prop => prop.themeMode === useThemeMode);
    const defaultMode = token.properties.find(prop => prop.themeMode === defaultThemeMode);
    const property = existCurrentMode ? existCurrentMode : defaultMode;
    if (property.useToken) {
        return traversingUseToken(getToken(property.useToken));
    }
    else {
        return property;
    }
}
export default function ($) {
    var Fill = function (element, options) {
        const useToken = getToken(options.useToken);
        let colorValue;
        let opacityValue;
        hostData = this;
        this.options = options.type === PropertyTypes.FILL_COLOR ? new FillColor(options) : new StrokeFill(options);
        $host = this.$element = $(element).attr('property-component', NAME);
        this.$customVal = $('<div class="custom-val"></div>');
        this.$valContainer = $('<div class="val-container"></div>');
        this.$colorValue = $('<span class="color-val"></span>').attr('contenteditable', !useToken);
        this.$colorOpacity = $('<span class="opacity-val"></span>').attr('contenteditable', !useToken);
        const commonSetting = { $token: null, $themeMode: null }; //CommonSettings(this);
        this.$token = commonSetting.$token;
        // const commonSetting = CommonSettings(this);
        // this.$token = commonSetting.$token;
        this.$themeMode = commonSetting.$themeMode;
        useToken ? colorValue = useToken.name : colorValue = this.options.color;
        opacityValue = this.options.opacity;
        this.$element
            .append(this.$customVal
            .append(this.$valContainer
            .append(this.$icon)
            .append(this.$colorValue.text(colorValue).attr('title', colorValue))
            .append(this.$colorOpacity.text(`${Math.floor(opacityValue * 100)}%`).addClass(this.tokenList.length ? 'hasReferenceToken' : ''))
            .append(this.$themeMode)
            .append(this.$token)));
        this.setIcon();
        $(document).trigger('property-preview', [this.options]);
    };
    Fill.prototype.setIcon = function () {
        // const newIcon = PropertyIcon([this.options]).$icon;
        // hostData.$icon.replaceWith(newIcon);
        // hostData.$icon = newIcon;
        // if (this.options.useToken || this.options.color === 'transparent' || this.options.color === 'null') {
        //   this.$colorOpacity.hide();
        //   this.$icon.attr('disabled', true);
        // } else {
        //   this.$colorOpacity.show();
        //   this.$icon.attr('disabled', false);
        // }
    };
    Fill.prototype.useToken = function (token) {
        const themeModes = getThemeMode();
        const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
        let property = token.properties.find(prop => prop.themeMode === getCurrentThemeMode());
        if (!property)
            property = token.properties.find(prop => prop.themeMode === defaultThemeMode);
        const { color, blendMode, fillType, opacity, visible } = property;
        Object.assign(this.options, { color, blendMode, fillType, opacity, visible });
        this.$colorValue
            .text(token.name)
            .attr('contenteditable', false)
            .attr('title', token.name);
        this.setIcon();
    };
    Fill.prototype.detachToken = function (token) {
        if (token.properties.length === 1) {
            let usedProperty = token.properties[0];
            if (usedProperty.useToken) {
                usedProperty = traversingUseToken(getToken(usedProperty.useToken));
            }
            this.$colorValue
                .text(usedProperty.color)
                .attr({
                'contenteditable': true,
                'title': usedProperty.color
            });
            this.$colorOpacity.text(`${Math.floor(usedProperty.opacity * 100)}%`).attr('contenteditable', true).show();
            this.setIcon();
        }
        else {
            $host.trigger('property-edit', [token.properties]);
        }
    };
    Fill.prototype.destroy = function () {
        return this.$element.removeAttr('property-component').empty().removeData().hide();
    };
    function Plugin(option) {
        return this.each(function () {
            const $this = $(this);
            let data = $this.data(NAME);
            let options;
            if (typeof option === 'object') {
                options = option;
            }
            else {
                options = { type: option };
            }
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data(NAME, (data = new Fill(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Fill;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    function change(event) {
        const $this = $(this);
        if (event.type === BrowserEvents.KEY_UP) {
            if (event.key === 'Enter')
                $('.btn-primary').trigger('focus');
            return;
        }
        const options = hostData.options;
        let value = $this.text().replace('#', '');
        if ($this.is('.color-val')) {
            if (!validateHTMLColorHex(`#${value}`) && value.toLowerCase() !== 'transparent' && value.toLowerCase() !== 'null') {
                value = options.color;
            }
            if (value.toLowerCase() === 'transparent' || value.toLowerCase() === 'null') {
                value = value.toLowerCase();
            }
            else {
                value = Color(`#${value}`).hex().replace('#', '');
            }
            options.color = value;
            $this.text(value);
        }
        else {
            value = value.replace('%', '');
            if (!validator.isInt(value))
                value = Math.floor(options.opacity * 100);
            value = Math.min(Math.max(0, value), 100);
            options.opacity = value / 100;
            $this.text(`${value}%`);
        }
        hostData.setIcon();
        $(document).trigger('property-preview', [options]);
    }
    function colorPicker(event) {
        if (!$(this).is('[disabled]')) {
            hostData.$icon.colorPicker({
                container: '#react-page',
                color: `#${hostData.options.color}`,
                opacity: hostData.options.opacity
            });
        }
    }
    function colorPickerChange(event, picker) {
        hostData.$colorValue.text(picker.color.replace('#', '')).trigger('blur');
        hostData.$colorOpacity.text(`${Math.floor(picker.opacity * 100)}%`).trigger('blur');
    }
    $(document)
        .off(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .color-val[contenteditable="true"], [property-component="${NAME}"] .opacity-val[contenteditable="true"]`)
        .on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .color-val[contenteditable="true"], [property-component="${NAME}"] .opacity-val[contenteditable="true"]`, change);
    $(document)
        .off(BrowserEvents.CLICK, `[property-component="${NAME}"] .fill-color-icon, [property-component="${NAME}"] .stroke-fill-icon`)
        .on(BrowserEvents.CLICK, `[property-component="${NAME}"] .fill-color-icon, [property-component="${NAME}"] .stroke-fill-icon`, colorPicker);
    $(document)
        .off('color-picker-change')
        .on('color-picker-change', colorPickerChange);
    return NAME;
}
(jQuery);
