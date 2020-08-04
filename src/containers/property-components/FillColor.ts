import validator from 'validator';
import { validateHTMLColorHex } from "validate-color";
import BrowserEvents from 'enums/BrowserEvents';
import { getToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';
import StrokeFill from 'model/StrokeFill';
import colorPicker from 'utils/colorPicker';
import PropertyIcon from './PropertyIcon';
import CommonSettings from './CommonSettings';

colorPicker(jQuery);

let hostData;
const NAME = 'color';
export default function ($) {
  var Fill = function (element, options) {
    const useToken = getToken(options.useToken);
    let colorValue;
    let opacityValue;

    hostData = this;
    this.options   = options.type === PropertyTypes.FILL_COLOR ? new FillColor(options) : new StrokeFill(options);
    this.$element  = $(element).attr('property-component', NAME);
    this.$customVal = $('<div class="custom-val"></div>');
    this.$valContainer = $('<div class="val-container"></div>');
    this.$colorValue = $('<span class="color-val"></span>').attr('contenteditable', !useToken);
    this.$colorOpacity = $('<span class="opacity-val"></span>').attr('contenteditable', !useToken);
    this.$token = CommonSettings(this).$token;
    
    useToken ? colorValue = useToken.name : colorValue = this.options.color;
    opacityValue = this.options.opacity;

    this.$element
      .append(
        this.$customVal
          .append(
            this.$valContainer
              .append(this.$icon)
              .append(
                this.$colorValue.text(colorValue).attr('title', colorValue)
              )
              .append(
                this.$colorOpacity.text(`${opacityValue * 100}%`).addClass(this.tokenList.length ? 'hasReferenceToken' : '')
              )
              .append(this.$token)
          )
      );
    this.setIcon();
    $(document).trigger('property-preview', [this.options]);
  }
  Fill.prototype.setIcon = function () {
    const newIcon = PropertyIcon(this.options).$icon;
    hostData.$icon.replaceWith(newIcon);
    hostData.$icon = newIcon;
    if (this.options.useToken) {
      this.$colorOpacity.hide();
      this.$icon.attr('disabled', true);
    } else {
      this.$icon.attr('disabled', false);
    }
  }
  Fill.prototype.useToken = function (token) {
    const { color, blendMode, fillType, opacity, visible } = token.properties[0];
    Object.assign(this.options, { color, blendMode, fillType, opacity, visible });
    this.$colorValue
      .text(token.name)
      .attr('contenteditable', false)
      .attr('title', token.name);
    this.setIcon();
  }
  Fill.prototype.detachToken = function (token) {
    const usedProperty = token.properties[0];

    this.$colorValue
      .text(usedProperty.color)
      .attr('contenteditable', true)
      .removeAttr('title');
    this.$colorOpacity.text(`${usedProperty.opacity * 100}%`).attr('contenteditable', true).show();
    this.setIcon();
  }
  Fill.prototype.destroy = function () {
    return this.$element.removeAttr('property-component').empty().removeData().hide();
  }
  function Plugin(option) {
    return this.each(function () {
      const $this   = $(this)
      let data      = $this.data(NAME);
      let options;
      if (typeof option === 'object') {
        options = option;
      } else {
        options = { type: option };
      }
      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new Fill(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = Fill;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

  function change (event) {
    const $this = $(this);
    if (event.type === BrowserEvents.KEY_UP) {
      if (event.key === 'Enter') $('.btn-primary').trigger('focus');
      return;
    }
    const options: FillColor = hostData.options;
    let value =  $this.text().replace('#', '');

    if ($this.is('.color-val')) {
      if (!validateHTMLColorHex(`#${value}`)) value = options.color;
      options.color = value;
      $this.text(value);
    } else {
      value = value.replace('%', '');
      if (!validator.isInt(value)) value = options.opacity * 100;
      value = Math.min(Math.max(0, value), 100);
      options.opacity = value / 100;
      $this.text(`${value}%`);
    }
    hostData.setIcon();
    $(document).trigger('property-preview', [options]);
  }

  function colorPicker (event) {
    if (!$(this).is('[disabled]')) {
      hostData.$icon.colorPicker({
        container: '#react-page',
        color: `#${hostData.options.color}`,
        opacity: hostData.options.opacity
      });
    }
  }

  function colorPickerChange (event, picker) {
    hostData.$colorValue.text(picker.color.replace('#', '')).trigger('blur');
    hostData.$colorOpacity.text(`${picker.opacity * 100}%`).trigger('blur');
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
}(jQuery);
