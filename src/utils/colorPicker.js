import Color from 'color';
import BrowserEvents from 'enums/BrowserEvents';
import ColorModes from 'enums/ColorModes';
let hostData;
const NAME = 'colorPicker';
var PickerMode;
(function (PickerMode) {
    PickerMode["SOLID"] = "SOLID";
    PickerMode["LINEAR"] = "LINEAR";
    PickerMode["RADIAL"] = "RADIAL";
    PickerMode["ANGULAR"] = "ANGULAR";
    PickerMode["DIAMOND"] = "DIAMOND";
})(PickerMode || (PickerMode = {}));
;
class Picker {
    constructor(options) {
        this.pickerMode = PickerMode.SOLID;
        this.opacity = 1;
        this.color = 0x257AC8;
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
        this.$pickerModeVal = $(`<span class="picker-mode-value">${this.options.pickerMode}</span>`);
        this.$pickerModeDropdownMenu = $(`
      <ul class="dropdown-menu pull-right">
        ${Object.keys(PickerMode)
            .map(mode => `<li><a href="#">${mode}</a></li>`)
            .join('')}
      </ul>
    `);
        this.$saturationViewContainer = $('<div class="saturation-view-container"></div>');
        this.$saturationView = $('<div class="saturation-view"></div>');
        this.$saturationHandler = $('<span class="saturation-handler"></span>').draggable({ containment: this.$saturationViewContainer });
        this.$slidersContainer = $('<div id="sliders-container" class="setting-row"></div>');
        this.$hueSliderContainer = $('<div class="hue-container"></div>');
        this.$hueSlider = $('<div class="hue-slider"></div>');
        this.$opacitySliderContainer = $('<div class="opacity-container"></div>');
        this.$opacitySlider = $('<div class="opacity-slider"></div>');
        this.$opacitySliderContainerPatch = $('<span class="opacity-container-patch"></span>');
        this.$cutomColorSettings = $('<div class="custom-color-setting" />');
        this.$colorMode = $(`
      <div class="color-mode btn-group">
        <button
          type="button"
          class="btn btn-sm btn-border dropdown-toggle"
          data-toggle="dropdown"
          value="hex"
        >
          <span>${ColorModes.HEX}</span>
          <i class="tmicon tmicon-caret-down"></i>
        </button>
      </div>
    `);
        this.$colorModeList = $('<ul class="dropdown-menu" />').append(Object.keys(ColorModes).map(mode => {
            return ($(`<li class="color-mode-${mode}"><a href="#">${ColorModes[mode]}</a></li>`));
        }));
        this.$hexInputs = $('<div class="custom-input btn-group"></div>');
        this.$hex = $('<div class="btn" contenteditable="true"></div>');
        this.$opacity = $('<div class="btn" contenteditable="true"></div>');
        const colorObj = Color(this.options.color);
        const { color: [hue, saturation, brightness] } = colorObj.hsv();
        this.hue = hue;
        this.saturation = saturation;
        this.brightness = brightness;
        this.$saturationHandler.css({
            position: 'absolute',
            top: `${(100 - brightness) * (255 / 100)}px`,
            left: `${saturation * (255 / 100)}px`
        });
        this.$colorPickerContainer
            .append(this.$colorPickerHeader
            .append(this.$turnBackBtn)
            .append(this.$pickerMode
            .append(this.$pickerModeToggle.append(this.$pickerModeVal))
            .append(this.$pickerModeDropdownMenu)))
            .append(this.$saturationViewContainer.append(this.$saturationView.append(this.$saturationHandler)))
            .append(this.$slidersContainer
            .append(this.$hueSliderContainer.append(this.$hueSlider.slider({ value: this.hue, max: 360 })))
            .append(this.$opacitySliderContainer
            .append(this.$opacitySliderContainerPatch)
            .append(this.$opacitySlider.slider({ value: this.options.opacity * 100 }))))
            .append(this.$cutomColorSettings
            .append(this.$colorMode.append(this.$colorModeList))
            .append(this.$hexInputs.append(this.$hex.add(this.$opacity))))
            .appendTo(options.container);
        this.$hueSliderHandler = this.$hueSlider.find('.ui-slider-handle');
        this.$opacitySliderHandler = this.$opacitySlider.find('.ui-slider-handle');
        this.changeVal(colorObj.hsv(), this.options.opacity * 100);
    };
    ColorPicker.prototype.changeHue = function (value) {
        const newColor = Color().hsv(value, this.saturation, this.brightness);
        this.changeVal(newColor, this.options.opacity * 100);
    };
    ColorPicker.prototype.changeOpacity = function (value) {
        const newColor = Color(this.options.color).hsv();
        this.changeVal(newColor, value);
    };
    ColorPicker.prototype.position = function (x, y, event) {
        const newColor = Color().hsv(this.hue, (x * 100 / 255), (100 - (y * 100 / 255)));
        let draggable = false;
        if (x < 0 || y < 0 || x > 255 || y > 255)
            return;
        if (!this.$saturationHandler.is('.hover'))
            draggable = true;
        this.$saturationHandler
            .css({
            left: `${x}px`,
            top: `${y}px`
        });
        if (draggable && event) {
            event.type = 'mousedown.draggable';
            event.target = hostData.$saturationHandler[0];
            hostData.$saturationHandler.trigger(event);
        }
        this.changeVal(newColor, this.options.opacity * 100);
    };
    ColorPicker.prototype.changeVal = function (color, opacity) {
        const { color: [hue, saturation, brightness] } = color;
        const rgbString = color.rgb().string();
        const { color: [_hue, _saturation, _lightness] } = color.hsl();
        this.$saturationView.add(this.$hueSliderHandler).css('background-color', Color().hsv(hue, 100, 100).rgb().string());
        this.$saturationHandler.add(this.$opacitySliderContainerPatch).css('background-color', rgbString);
        this.$opacitySlider.css('background-image', `linear-gradient(270deg, ${rgbString}, transparent)`);
        this.$opacitySliderHandler.css('background', Color().hsl(_hue, _saturation, (_lightness + (100 - opacity) * ((100 - _lightness) / 100))).rgb().string());
        this.hue = hue;
        this.saturation = saturation;
        this.brightness = brightness;
        this.options.color = color.hex();
        this.options.opacity = opacity / 100;
        this.$hex.text(color.hex().replace('#', ''));
        this.$opacity.text(`${opacity}%`);
    };
    ColorPicker.prototype.destroy = function () {
        return this.$colorPickerContainer.remove();
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(NAME);
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data(NAME, (data = new ColorPicker(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = ColorPicker;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    $(document).on(BrowserEvents.CLICK, `#color-picker-container .turn-back-btn`, function (event) {
        hostData.destroy();
    });
    $(document).on("slide", '.hue-slider, .opacity-slider', function (event, ui) {
        $(event.target).is('.hue-slider') ? hostData.changeHue(ui.value) : hostData.changeOpacity(ui.value);
    });
    $(document).on(BrowserEvents.MOUSE_DOWN, '.saturation-view', function (event) {
        hostData.position(event.pageX - 5, event.pageY - 44, event);
    });
    $(document).on(`${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '.saturation-handler', function (event) {
        event.type === BrowserEvents.MOUSE_OVER ? $(this).addClass('hover') : $(this).removeClass('hover');
    });
    $(document).on(BrowserEvents.DRAG, '.saturation-handler', function (event, ui) {
        const { left, top } = $(this).position();
        hostData.position(left, top);
    });
    return NAME;
}
(jQuery);
