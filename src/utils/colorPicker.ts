import Color from 'color';
import { validateHTMLColorHex } from "validate-color";
import BrowserEvents from 'enums/BrowserEvents';
import ColorFormat from 'enums/ColorFormat';

let hostData;
const NAME = 'colorPicker';
enum PickerMode {
  SOLID = 'SOLID',
  LINEAR = 'LINEAR',
  RADIAL = 'RADIAL',
  ANGULAR = 'ANGULAR',
  DIAMOND = 'DIAMOND'
};

class Picker {
  mode: PickerMode = PickerMode.SOLID;
  color: number = 0xC4C4C4;
  opacity: number = 100;
  format: string = ColorFormat.HEX;
  constructor(options?: any) {
    if (options.mode) this.mode = options.mode;
    if (options.color != null) this.color = options.color;
    if (options.opacity != null) this.opacity = options.opacity;
  }
}

export default function ($) {
  var ColorPicker = function (element, options) {
    hostData = this;
    this.$element = $(element);
    this.options = new Picker(options);
    this.$colorPickerContainer = $('<div id="color-picker-container"></div>');
    this.$colorPickerHeader = $('<div id="color-picker-header" class="setting-row"></div>');
    this.$turnBackBtn = $(`
      <div class="turn-back-btn">
        <svg class="svg" width="8" height="13" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 6.5l-.353-.354-.354.354.354.354L1 6.5zM6.647.146l-6 6 .707.708 6-6-.707-.708zm-6 6.708l6 6 .707-.708-6-6-.707.708z" fill-rule="nonzero" fill-opacity="1" fill="inherit" stroke="none"></path>
        </svg>
      </div>
    `);
    this.$pickerMode = $(`<div id="picker-mode" class="btn-group"></div>`);
    this.$pickerModeToggle = $(`
      <button type="button" class="btn btn-border btn-sm dropdown-toggle" data-toggle="dropdown">
        <span class="tmicon tmicon-caret-down"></span>
      </button>
    `);
    this.$pickerModeVal = $(`<span class="picker-mode-value">${this.options.mode}</span>`);
    this.$pickerModeDropdownMenu = $(`
      <ul class="dropdown-menu pull-right">
        ${Object.keys(PickerMode)
          .map(mode => `<li><a href="#">${mode}</a></li>`)
          .join('')
        }
      </ul>
    `);
    this.$hsvViewContainer = $('<div class="hsv-view-container view-container"></div>');
    this.$hsvView = $('<div class="hsv-view"></div>');
    this.$hsvHandler = $('<span class="hsv-handler"></span>').draggable({ containment: this.$hsvViewContainer });
    
    this.$hslViewContainer = $('<div class="hsl-view-container view-container"></div>');
    this.$hslView = $('<div class="hsl-view"></div>');
    this.$hslHandler = $('<span class="hsl-handler"></span>').draggable({ containment: this.$hslViewContainer });

    
    this.$slidersContainer = $('<div id="sliders-container" class="setting-row"></div>');
    this.$hueSliderContainer = $('<div class="hue-container"></div>');
    this.$hueSlider = $('<div class="hue-slider"></div>');
    this.$opacitySliderContainer = $('<div class="opacity-container"></div>');
    this.$opacitySlider = $('<div class="opacity-slider"></div>');
    this.$opacitySliderContainerPatch = $('<span class="opacity-container-patch"></span>');

    this.$cutomColorSettings = $('<div class="custom-color-setting" />');
    this.$colorFormat = $(`
      <div class="color-mode btn-group">
        <button
          type="button"
          class="btn btn-sm btn-border dropdown-toggle"
          data-toggle="dropdown"
          value="hex"
        >
          <i class="tmicon tmicon-caret-down"></i>
        </button>
      </div>
    `);
    this.$colorFormatVal = $(`<span></span>`);
    this.$colorFormatList = $('<ul class="dropdown-menu" />').append(
      Object.keys(ColorFormat).map(mode => {
        return ($(`<li class="color-mode-${mode}"><a href="#">${ColorFormat[mode]}</a></li>`));
      })
    );  
    this.$hexInputs = $('<div class="hex-input-container input-container btn-group"></div>');
    this.$hex = $('<div class="btn" contenteditable="true"></div>');
    this.$rgbInputs = $('<div class="rgb-input-container input-container btn-group"></div>');
    this.$r = $('<div class="btn" color="r" contenteditable="true"></div>');
    this.$g = $('<div class="btn" color="g" contenteditable="true"></div>');
    this.$b = $('<div class="btn" color="b" contenteditable="true"></div>');
    this.$hslInputs = $('<div class="hsl-input-container input-container btn-group"></div>');
    this.$hsl_hue = $('<div class="btn" color="h" contenteditable="true"></div>');
    this.$hsl_saturation = $('<div class="btn" color="s" contenteditable="true"></div>');
    this.$hsl_lightness = $('<div class="btn" color="l" contenteditable="true"></div>');
    this.$hsvInputs = $('<div class="hsv-input-container input-container btn-group"></div>');
    this.$hsv_hue = $('<div class="btn" color="h" contenteditable="true"></div>');
    this.$hsv_saturation = $('<div class="btn" color="s" contenteditable="true"></div>');
    this.$hsv_brightness = $('<div class="btn" color="v" contenteditable="true"></div>');
    
    this.$opacity = $('<div class="btn" color="o" contenteditable="true"></div>');
    this.$colorPickerContainer
      .append(
        this.$colorPickerHeader
          .append(this.$turnBackBtn)
          .append(
            this.$pickerMode
              .append(
                this.$pickerModeToggle.append(this.$pickerModeVal)
              )
              .append(this.$pickerModeDropdownMenu)
          )
      )
      .append(
        this.$hsvViewContainer.append(this.$hsvView.append(this.$hsvHandler))
      )
      .append(
        this.$hslViewContainer.append(this.$hslView.append(this.$hslHandler))
      )
      .append(
        this.$slidersContainer
          .append(
            this.$hueSliderContainer.append(this.$hueSlider.slider({ max: 360 }))
          )
          .append(
            this.$opacitySliderContainer
              .append(this.$opacitySliderContainerPatch)
              .append(
                this.$opacitySlider.slider()
              )
          )
      )
      .append(
        this.$cutomColorSettings
          .append(
            this.$colorFormat.children('button').append(this.$colorFormatVal).end().append(this.$colorFormatList)
          )
          .append(this.$hexInputs.append(this.$hex))
          .append(this.$rgbInputs.append(this.$r.add(this.$g).add(this.$b)))
          .append(this.$hslInputs.append(this.$hsl_hue.add(this.$hsl_saturation).add(this.$hsl_lightness)))
          .append(this.$hsvInputs.append(this.$hsv_hue.add(this.$hsv_saturation).add(this.$hsv_brightness)))
      )
      .appendTo(options.container);
    
    this.$hueSliderHandler = this.$hueSlider.find('.ui-slider-handle');
    this.$opacitySliderHandler = this.$opacitySlider.find('.ui-slider-handle');

    const color = Color().hex(this.options.color);
    this.setFormat(ColorFormat.HEX);
    this.setColor(color);
    this.setOpacity(this.options.opacity);
    this.setVal();
    this.setHandler();
  }
  
  ColorPicker.prototype.setHue = function (value: number) {
    const color = Color().hsv(value, this.hsvSaturation, this.brightness);
    this.setColor(color);
    this.setVal();
  }
  ColorPicker.prototype.setOpacity = function (value: number) {
    this.opacity = value;
    this.options.opacity = value;
    this.setVal();
  }
  ColorPicker.prototype.position = function (x, y, event?) {
    const format = this.format === ColorFormat.HSL ? 'hsl' : 'hsv';
    const color = Color()[format](this.hue, (x * 100 / 255), (100 - (y * 100 / 255)));
    let draggable = false;

    if (x < 0 || y < 0 || x > 255 || y > 255) return;
    if (!this[`$${format}Handler`].is('.hover')) draggable = true;

    if (draggable && event) {
      event.type = 'mousedown.draggable';
      event.target = this[`$${format}Handler`][0];
      this[`$${format}Handler`].trigger(event);
    }
    this.setColor(color);
    this.setVal();
    this.setHandler();
  }
  ColorPicker.prototype.setColor = function (color, customHue?) {
    const { color: [r, g, b] } = color.rgb();
    const { color: [hslHsu, hslSaturation, lightness] } = color.hsl();
    let { color: [hue, hsvSaturation, brightness] } = color.hsv();
  
    if (customHue) {
      hue = customHue;
    }

    this.hex = color.hex();
    this.r = r;
    this.g = g;
    this.b = b;
    this.rgbString = color.rgb().string();
    this.hue = hue;
    this.hsvSaturation = hsvSaturation;
    this.brightness = brightness;
    this.hslSaturation = hslSaturation;
    this.lightness = lightness;
    this.options.color = this.hex;
  }
  ColorPicker.prototype.setHandler = function () {
    this.$hsvHandler.css({
      position: 'absolute',
      top: `${(100 - this.brightness) * (255 / 100)}px`,
      left: `${this.hsvSaturation * (255 / 100)}px`
    });
    this.$hslHandler.css({
      position: 'absolute',
      top: `${(100 - this.lightness) * (255 / 100)}px`,
      left: `${this.hslSaturation * (255 / 100)}px`
    });
  }
  ColorPicker.prototype.setVal = function () {
    this.$hsvView.add(this.$hslView).add(this.$hueSliderHandler).css('background-color', Color().hsv(this.hue, 100, 100).rgb().string());
    this.$hsvHandler.add(this.$hslHandler).add(this.$opacitySliderContainerPatch).css('background-color', this.rgbString);
    this.$opacitySlider.css('background-image', `linear-gradient(270deg, ${this.rgbString}, transparent)`);
    this.$opacitySliderHandler.css('background', Color().hsl(this.hue, this.hslSaturation, (this.lightness + (100 - this.opacity) * ((100 - this.lightness) / 100))).rgb().string());
    this.$hex.text(this.hex.replace('#', ''));
    this.$r.text(Math.round(this.r));
    this.$g.text(Math.round(this.g));
    this.$b.text(Math.round(this.b));
    this.$hsl_hue.text(Math.round(this.hue));
    this.$hsl_saturation.text(Math.round(this.hslSaturation));
    this.$hsl_lightness.text(Math.round(this.lightness));
    this.$hsv_hue.text(Math.round(this.hue));
    this.$hsv_saturation.text(Math.round(this.hsvSaturation));
    this.$hsv_brightness.text(Math.round(this.brightness));
    this.$opacity.text(`${this.opacity}%`);
    this.$hueSlider.slider( "option", "value", this.hue);
    this.$opacitySlider.slider( "option", "value", this.opacity);
  }
  ColorPicker.prototype.setFormat = function (format) {
    this.options.format = format;
    this.format = format;
    this.$colorFormatVal.text(format);
    $('.view-container').add($(`.input-container`)).hide();
    $(`.${format}-input-container`).append(this.$opacity).css('display', 'flex');

    format === ColorFormat.HSL ? this.$hslViewContainer.show() : this.$hsvViewContainer.show();
  }
  ColorPicker.prototype.destroy = function () {
    return this.$colorPickerContainer.remove();
  }
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data(NAME);
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new ColorPicker(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = ColorPicker;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

  $(document).on(BrowserEvents.CLICK, `#color-picker-container .turn-back-btn`, function (event) {
    hostData.$element.trigger('color-picker-change', [hostData.options]);
    hostData.destroy();
  });

  $(document).on( "slide", '.hue-slider, .opacity-slider', function (event, ui) {
    $(event.target).is('.hue-slider') ? hostData.setHue(ui.value) : hostData.setOpacity(ui.value)
  });
  
  $(document).on(BrowserEvents.MOUSE_DOWN, '.hsv-view, .hsl-view', function (event) {
    hostData.position(event.pageX - 5, event.pageY - 44, event);
  });

  $(document).on(`${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '.hsv-handler, .hsl-handler', function (event) {
    event.type === BrowserEvents.MOUSE_OVER ? $(this).addClass('hover') : $(this).removeClass('hover');
  });

  $(document).on(BrowserEvents.DRAG, '.hsv-handler, .hsl-handler', function( event, ui ) {
    const { left, top } = $(this).position();
    hostData.position(left, top);
  });

  $(document).on(BrowserEvents.CLICK, '.color-mode .dropdown-menu li a', function (event) {
    hostData.setFormat(this.innerText);
  });

  $(document).on(BrowserEvents.FOCUS, `#color-picker-container [contenteditable="true"]`, function () {
    $(this).selectText();
  });

  $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `#color-picker-container [contenteditable="true"]`, function (event) {
    if (event.type === BrowserEvents.KEY_UP) {
      if (event.key === 'Enter') {
        this.blur();
      } 
      return;
    }
    
    const color = $(this).attr('color');
    let value = this.innerText;

    if (color === 'o') {
      value = value.replace('%', '');
      if (!isNaN(value)) {
        value = Math.min(100, Math.max(0, Number(value)));
        hostData.setOpacity(Number(value));
        hostData.setHandler();
      }
      this.innerText = `${hostData.opacity}%`;
      return;
    }

    if (hostData.format === ColorFormat.HEX) {
      if (validateHTMLColorHex(`#${value}`)) {
        hostData.setColor(Color().hex(`#${value}`));
        hostData.setVal();
        hostData.setHandler();
      }
      this.innerText = hostData.hex.replace('#', '');
    }
    if (hostData.format === ColorFormat.RGB) {
      const colorIndex = { r: 0, g: 1, b: 2 };
      const val= [hostData.r, hostData.g, hostData.b];
      if (!isNaN(value)) {
        value = Math.min(255, Math.max(0, Number(value)));
        val.splice(colorIndex[color], 1, Math.round(Number(value)));

        hostData.setColor(Color(val), val.filter(item => item !== 255).length === 0 ? hostData.hue : null);
        hostData.setVal();
        hostData.setHandler();
      }
      this.innerText = hostData[color];
    } 
    if (hostData.format === ColorFormat.HSL) {
      const colorIndex = { h: 0, s: 1, l: 2 };
      const val= [hostData.hue, hostData.hslSaturation, hostData.lightness];
      if (!isNaN(value)) {
        if (color === 'h') value = Math.min(360, Math.max(0, Number(value)));
        if (color === 's') value = Math.min(100, Math.max(0, Number(value)));
        if (color === 'l') value = Math.min(100, Math.max(0, Number(value)));
        
        val.splice(colorIndex[color], 1, Number(value));

        hostData.setColor(Color().hsl(...val), val[0]);
        hostData.setVal();
        hostData.setHandler();
      } else {
        this.innerText = Math.round(val[colorIndex[color]]);
      }
    }
    if (hostData.format === ColorFormat.HSV) {
      const colorIndex = { h: 0, s: 1, v: 2 };
      const val= [hostData.hue, hostData.hsvSaturation, hostData.brightness];
      if (!isNaN(value)) {
        if (color === 'h') value = Math.min(360, Math.max(0, Number(value)));
        if (color === 's') value = Math.min(100, Math.max(0, Number(value)));
        if (color === 'v') value = Math.min(100, Math.max(0, Number(value)));
        
        val.splice(colorIndex[color], 1, Number(value));

        hostData.setColor(Color().hsv(...val), val[0]);
        hostData.setVal();
        hostData.setHandler();
      } else {
        this.innerText = Math.round(val[colorIndex[color]]);
      }
    }
  });
  return NAME;
}(jQuery);