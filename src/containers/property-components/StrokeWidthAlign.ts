import validator from 'validator';
import StrokeWidthAlign from 'model/StrokeWidthAlign';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getPureToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
// import CommonSettings from './CommonSettings.tss';

let hostData;
const NAME = 'stroke';
export default function ($) {
  var Stroke = function (element, options) {
    const useToken = getToken(options.useToken);
    let strokeValue;

    hostData = this;
    this.options   = new StrokeWidthAlign(options);
    this.$element  = $(element).attr('property-component', NAME);
    this.$customVal = $('<div class="custom-val"></div>');
    this.$valContainer = $('<div class="val-container"></div>');
    this.$stokeValue = $('<span class="stroke-val"></span>').attr('contenteditable', !useToken);
    this.$align = $('<div class="stroke-align btn-group" />');
    this.$alignDropdownBtn = $(`
      <button type="button" class="btn btn-border dropdown-toggle" data-toggle="dropdown">
        <span class="tmicon tmicon-caret-down"></span>

      </button>
    `);
    this.$alignDropdownBtnVal = $(`<span>${this.options.align}</span>`);
    this.$alignDropdowns = $(`<ul class="dropdown-menu dropdown-menu-multi-select pull-right" />`);
    this.$alignOptions = Object.keys(StrokeAligns).reduce((calc, key) => calc.add($(`<li><a href="#">${key}</a></li>`)), $());
    
    const commonSetting = { $token: null } //CommonSettings(this);
    this.$token = commonSetting.$token;

    useToken ? strokeValue = useToken.name : strokeValue = this.options.width;

    this.$element
      .append(
        this.$customVal
          .append(
            this.$valContainer
              .append(this.$icon)
              .append(
                this.$stokeValue.text(strokeValue).attr('title', strokeValue).addClass(this.tokenList.length ? 'hasReferenceToken' : '')
              )
              .append(this.$token)
          )
          .append(
            this.$align[useToken ? 'hide' : 'show']()
              .append(this.$alignDropdownBtn.append(this.$alignDropdownBtnVal))
              .append(this.$alignDropdowns.append(this.$alignOptions))
          )
      );

    useToken ? this.$detachToken.data('token', useToken).show() : this.$detachToken.hide();
  
    this.setAlign(this.options.align);
    $(document).trigger('property-preview', [this.options]);
  }
  Stroke.prototype.useToken = function (token) {
    const { width, align } = token.properties[0];
    Object.assign(this.options, { width, align });
    this.$stokeValue.text(token.name)
      .attr('contenteditable', false)
      .attr('title', token.name)
      .removeAttr('title');
    this.$alignDropdownBtnVal.text(align);
    this.$align.hide();
  }
  Stroke.prototype.detachToken = function (token) {
    const usedProperty = token.properties[0];
    this.$stokeValue.text(usedProperty.width).attr('contenteditable', true);
    this.$align.show();
    this.$alignDropdowns
      .children()
      .removeClass('selected')
      .children()
      .filter((index, item) => item.textContent === usedProperty.align)
      .parent()
      .addClass('selected');
  }
  Stroke.prototype.setAlign = function (align, isPreview = false) {
    this.options.align = align;
    this.$alignDropdownBtnVal.text(align);
    this.$alignDropdowns
      .children()
      .removeClass('selected')
      .children()
      .filter((index, item) => item.textContent === align)
      .parent()
      .addClass('selected');

    if (isPreview) $(document).trigger('property-preview', [this.options]);
  }
  Stroke.prototype.destroy = function () {
    return this.$element.removeAttr('property-component').empty().removeData().hide();
  }
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data(NAME);
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new Stroke(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = Stroke;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

  $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .stroke-val[contenteditable="true"]`, function (event) {
    if (event.type === BrowserEvents.KEY_UP) {
      if (event.key === 'Enter') $('.btn-primary').trigger('focus');
      return;
    }
    const $this = $(this);
    const options = hostData.options;
    const value =  $this.text();
    const oldVal = options.width;

    if (validator.isInt(value)) {
      options.width = Number(value);
      hostData.$stokeValue.text(value);
    } else {
      $this.text(oldVal);
    }
    $(document).trigger('property-preview', [options]);
  });
  $(document).on(BrowserEvents.CLICK, '.stroke-align .dropdown-menu li a', function (event) {
    hostData.setAlign(this.textContent, true);
  });
  return NAME;
}(jQuery);

