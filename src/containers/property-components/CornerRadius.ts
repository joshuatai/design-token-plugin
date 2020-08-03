import validator from 'validator';
import CornerRadius from 'model/CornerRadius';
import camelize from 'utils/camelize';
import BrowserEvents from 'enums/BrowserEvents';
import { Mixed } from 'symbols/index';
import { getToken, getPureToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import PropertyIcon from './PropertyIcon';
import Token from './Token';

let hostData;
const NAME = 'radius';
const separators = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

export default function ($) {
  var Radius = function (element, options) {
    const useToken = getToken(options.useToken);
    let radiusValue;

    hostData = this;
    this.options   = new CornerRadius(options);
    this.$element  = $(element).attr('property-component', NAME).addClass('show');
    this.$customVal = $('<div class="custom-val"></div>');
    this.$valContainer = $('<div class="val-container"></div>');
    this.$radiusIcon = PropertyIcon(this.options).$icon;
    this.$radiusValue = $('<span class="corner-radius-val"></span>').attr('contenteditable', !useToken);
    this.$separateToggle = $('<button id="separator-toggle" type="button" class="btn separator-icon" data-toggle="button" aria-pressed="false" autoComplete="off"><svg class="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h3v1H1v2H0V0zm7 0h3v3H9V1H7V0zM1 9V7H0v3h3V9H1zm9-2v3H7V9h2V7h1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
    this.$separateSetting =  $('<div class="separator-vals"></div>');
    this.$separateIcon = $('<i class="separator-mode-sign" separate-type="top-left"></i>');
    this.$separatorGroup = $('<div class="btn-group"></div>');
    this.$propertyView = this.$element.data('propertyView');
    this.tokensMap = getPureToken(PropertyTypes.CORNER_RADIUS);
    this.$token = Token(this);

    useToken ?
      radiusValue = useToken.name :
      radiusValue = typeof this.options.radius === 'number' ? this.options.radius : 'Mixed';

    this.$element
      .append(
        this.$customVal
          .append(this.$separateToggle[useToken ? 'hide' : 'show']())
          .append(
            this.$valContainer
              .append(this.$radiusIcon)
              .append(
                this.$radiusValue
                  .addClass(this.tokenList.length ? 'hasReferenceToken' : '') 
                  .text(radiusValue)
                  .attr('title', radiusValue)
              )
              .append(this.$token)
          )
          .append(
            this.$separateSetting
              .append(this.$separateIcon)
              .append(
                this.$separatorGroup.append(
                  (this.$separateRadius = separators.reduce((calc, separator) => {
                    return calc.add($(`<div class="btn" data-separate-type="${separator}" contenteditable="true">${this.options[camelize(separator)]}</div>`))
                  }, $()))
                )
              )
          )
      );
    $(document).trigger('property-preview', [this.options]);
  }
  Radius.prototype.useToken = function (token) {
    const { radius, topLeft, topRight, bottomRight, bottomLeft } = token.properties[0];
    Object.assign(this.options, {
      radius,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    });
    this.$radiusValue
      .text(token.name)
      .attr('contenteditable', false)
      .attr('title', token.name);
    this.$separateToggle.hide();
  }
  Radius.prototype.detachToken = function (token) {
    const usedProperty = token.properties[0];
    this.$radiusValue
      .text(typeof usedProperty.radius === 'symbol' ? 'Mixed' : usedProperty.radius)
      .attr('contenteditable', true)
      .removeAttr('title');
    separators.forEach(type => {
      $(`[data-separate-type="${type}"]`).text(this.options[camelize(type)]);
    });
    this.$separateToggle.show();
  }
  Radius.prototype.destroy = function () {
    return this.$element.removeAttr('property-component').empty().removeData().hide();
  }
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data(NAME);
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new Radius(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = Radius;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

  $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] [data-separate-type]`, function () {
    const separateBtn = $(this);
    hostData.$separateIcon.attr('separate-type', separateBtn.data('separate-type'));
  });
  $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .separator-vals [data-separate-type], [property-component="${NAME}"] .corner-radius-val[contenteditable="true"]`, function (event) {
    if (event.type === BrowserEvents.KEY_UP && event.key !== 'Enter') {
      return;
    }
    const $this = $(this);
    const { separateType } = $this.data();
    const options = hostData.options;
    const value =  $this.text();
    let oldVal;
    if (separateType) {
      oldVal = options[camelize(separateType)];
      if (validator.isInt(value)) {
        options[camelize(separateType)] = Number(value);
        const uniqueValues = [...new Set(
            separators.map(type => options[camelize(type)])
          )
        ];
        if (uniqueValues.length === 1) {
          hostData.$radiusValue.text(value);
          options.radius = Number(value);
        } else {
          hostData.$radiusValue.text('Mixed');
          options.radius = Mixed;
        }
      } else {
        $this.text(oldVal);
      }
    } else {
      oldVal = options.radius;
      if (validator.isInt(value)) {
        options.radius = Number(value);
        separators.forEach(type => {
          options[camelize(type)] = Number(value);
        });
        hostData.$separateRadius.text(value);
      } else {
        if (typeof oldVal === 'symbol') {
          $this.text('Mixed');
        } else {
          $this.text(oldVal);
        }
      }
    }
    $(document).trigger('property-preview', [options]);
  });
  return NAME;
}(jQuery);

