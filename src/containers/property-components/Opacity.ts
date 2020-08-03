import validator from 'validator';
import OpacityModel from 'model/Opacity';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getPureToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import PropertyIcon from './PropertyIcon';
import Token from './Token';

let hostData;
const NAME = 'opacity';

export default function ($) {
  var Opacity = function (element, options) {
    const useToken = getToken(options.useToken);
    let opacityValue;

    hostData = this;
    this.options   = new OpacityModel(options);
    this.$element  = $(element).attr('property-component', NAME).addClass('show');
    this.$customVal = $('<div class="custom-val"></div>');
    this.$valContainer = $('<div class="val-container"></div>');
    this.$opacityIcon = PropertyIcon(this.options).$icon;
    this.$opacityValue = $('<span class="opacity-val"></span>').attr('contenteditable', !useToken);
    this.$propertyView = this.$element.data('propertyView');
    this.tokensMap = getPureToken(PropertyTypes.OPACITY);
    this.$token = Token(this);

    useToken ? opacityValue = useToken.name : opacityValue = `${this.options.opacity}%`;

    this.$element
      .append(
        this.$customVal
          .append(
            this.$valContainer
              .append(this.$opacityIcon)
              .append(
                this.$opacityValue.text(opacityValue).attr('title', opacityValue).addClass(this.tokenList.length ? 'hasReferenceToken' : '')
              )
              .append(this.$token)
          )
      );
    $(document).trigger('property-preview', [this.options]);
  }
  Opacity.prototype.useToken = function (token) {
    this.options.opacity = token.properties[0].opacity;
    this.$opacityValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
  }
  Opacity.prototype.detachToken = function (token) {
    const usedProperty = token.properties[0];
    this.$opacityValue
      .text(`${usedProperty.opacity}%`)
      .attr('contenteditable', true)
      .removeAttr('title');
  }
  Opacity.prototype.destroy = function () {
    return this.$element.removeAttr('property-component').empty().removeData().hide();
  }
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data(NAME);
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new Opacity(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = Opacity;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

  $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .opacity-val[contenteditable="true"]`, function (event) {
    if (event.type === BrowserEvents.KEY_UP && event.key !== 'Enter') {
      return;
    }
    const $this = $(this);
    const options = hostData.options;
    let value =  $this.text();
    value = value.replace('%', '');
    if (!validator.isInt(value)) value = options.opacity;
    value = Math.min(Math.max(0, value), 100);
    options.opacity = value;
    $this.text(`${value}%`);
    $(document).trigger('property-preview', [options]);
  });
  return NAME;
}(jQuery);

