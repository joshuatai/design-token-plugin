import validator from 'validator';
import { validateHTMLColorHex } from "validate-color";
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getPureToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import FillColor from 'model/FillColor';
import colorPicker from 'utils/colorPicker';

colorPicker(jQuery);

let hostData;
const NAME = 'color';
export const icon = '<div class="color-icon"><div class="color-icon-opacity"></div></div>';
export default function ($) {
  var Color = function (element, options) {
    const tokensMap = getPureToken(PropertyTypes.FILL_COLOR);
    let tokenList = Object.keys(tokensMap).map(key => tokensMap[key]);
    const useToken = getToken(options.useToken);
    let colorValue;
    let opacityValue;

    hostData = this;
    this.options   = new FillColor(options);
    this.$element  = $(element).attr('property-component', NAME).addClass('show');
    this.$customVal = $('<div class="custom-val"></div>');
    this.$valContainer = $('<div class="val-container"></div>');
    this.$ColorIcon = $(icon).css('background', `#${this.options.color}`);
    this.$colorValue = $('<span class="color-val"></span>').attr('contenteditable', !useToken);
    this.$colorOpacity = $('<span class="opacity-val"></span>').attr('contenteditable', !useToken);
    this.$detachToken = $(`
      <div class="detach-token">
        <svg class="svg" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M4 0v3h1V0H4zm9.103.896c-1.162-1.161-3.045-1.161-4.207 0l-2.75 2.75.707.708 2.75-2.75c.771-.772 2.022-.772 2.793 0 .771.77.771 2.021 0 2.792l-2.75 2.75.707.708 2.75-2.75c1.162-1.162 1.162-3.046 0-4.208zM.896 13.103c-1.162-1.161-1.162-3.045 0-4.207l2.75-2.75.707.708-2.75 2.75c-.771.77-.771 2.021 0 2.792.771.772 2.022.772 2.793 0l2.75-2.75.707.707-2.75 2.75c-1.162 1.162-3.045 1.162-4.207 0zM14 10h-3V9h3v1zM10 11v3H9v-3h1zM3 4H0v1h3V4z" fill-rule="nonzero" fill-opacity=".9" fill="#000" stroke="none"></path></svg>
      </div>`
    );
    this.$useToken = $(`
      <div class="dropdown">
        <div class="use-token" data-toggle="dropdown">
          <svg className="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg>
        </div>
      </div>`
    );

    this.$tokenList = $('<ul class="dropdown-menu pull-right"></ul>');
    this.$propertyView = this.$element.data('propertyView');
    this.token = this.$element.data('token');
    
    tokenList = tokenList.filter(token => token.id !== this.token.id);
    
    if (useToken) {
      colorValue = useToken.name;
      this.$colorOpacity.hide();
    } else {
      colorValue = this.options.color;
      opacityValue = this.options.opacity;
    }
    this.$ColorIcon.children().css('opacity', (100 - (opacityValue * 100)) / 100);
    this.$element
      .append(
        this.$customVal
          .append(
            this.$valContainer
              .append(this.$ColorIcon)
              .append(
                this.$colorValue.text(colorValue).attr('title', colorValue)
              )
              .append(
                this.$colorOpacity.text(`${opacityValue * 100}%`)
              )
              .append(
                tokenList.length ?
                this.$detachToken.add(this.$useToken.append(
                  this.$tokenList.append(
                    tokenList.map(token => $(`<li class="token-item"><a href="#">${token.name}</a></li>`).data('token', token))
                  )
                )) :
                null
              )
          )
      );
    
    this.options.parent = this.token.id;
    useToken ? this.$detachToken.data('token', useToken).show() : this.$detachToken.hide();
    this.$element.data('value', this.options);
    $(document).trigger('property-preview', [this.options]);
  }
  Color.prototype.useToken = function (token) {
    const { color, blendMode, fillType, opacity, visible } = token.properties[0];
    Object.assign(this.options, {
      useToken: token.id, color, blendMode, fillType, opacity, visible
    });
    this.$colorValue.text(token.name).attr('contenteditable', false);
    this.$colorOpacity.hide();
    this.$ColorIcon.css('background', `#${color}`);
    this.$detachToken.data('token', token).show();
  }
  Color.prototype.detachToken = function (token) {
    const usedProperty = token.properties[0];
    this.options.useToken = '';
    this.$colorValue.text(usedProperty.color).attr('contenteditable', true);
    this.$colorOpacity.show();
    this.$detachToken.removeData('token').hide();
  }
  Color.prototype.destroy = function () {
    return this.$element.removeAttr('property-component').empty().removeData().hide();
  }
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data(NAME);
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new Color(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = Color;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

  
  $(document).on(BrowserEvents.FOCUS, `[property-component="${NAME}"] [contenteditable="true"]`, function () {
    $(this).selectText();
  });
  $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .color-val[contenteditable="true"], [property-component="${NAME}"] .opacity-val[contenteditable="true"]`, function (event) {
    const $this = $(this);
    if (event.type === BrowserEvents.KEY_UP) {
      if (event.key === 'Enter') $('.btn-primary').trigger('focus');
      return;
    }
    const options: FillColor = hostData.options;
    let value =  $this.text();

    if ($this.is('.color-val')) {
      if (!validateHTMLColorHex(`#${value}`)) value = options.color;
      options.color = value;
      $this.text(value);
      hostData.$ColorIcon.css('background', `#${value}`);
    } else {
      value = value.replace(/[\s\%]/gi, '');
      if (!validator.isInt(value)) value = options.opacity * 100;
      value = Math.min(Math.max(0, value), 100);
      options.opacity = value / 100;
      $this.text(`${value}%`);
      hostData.$ColorIcon.children().css('opacity', (100 - value) / 100);
    }
    
    $(document).trigger('property-preview', [options]);
  });

  // $(document).on(BrowserEvents.CLICK, '.stroke-align .dropdown-menu li a', function (event) {
  //   hostData.options.align = this.textContent;
  //   hostData.$alignDropdownBtnVal.text(this.textContent);
  //   $(document).trigger('property-preview', [hostData.options]);
  // });
  
  $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .token-item`, function (event) {
    hostData.useToken($(this).data('token'));
    $(document).trigger('property-preview', [hostData.options]);
  });
  $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .detach-token`, function (event) {
    hostData.detachToken($(this).data('token'));
  });
  $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .color-icon`, function (event) {
    hostData.$ColorIcon.colorPicker({
      container: '#react-page'
    });
  });
  
  return NAME;
}(jQuery);

