import Color from 'color';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';

let hostData;

const consolidateProperties = (properties) => {
  let color;
  const css = properties.reduce((calc, property) => {
    if (property.type === PropertyTypes.CORNER_RADIUS) {
      calc['border-top-left-radius'] = property.topLeft;
      calc['border-top-right-radius'] = property.topRight;
      calc['border-bottom-right-radius'] = property.bottomRight;
      calc['border-bottom-left-radius'] = property.bottomLeft;
    }
    if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
      calc['border-width'] = `${property.width}px`;
      calc['border-style'] = 'solid';
      calc['border-color'] = '#000000';
      if (property.align === StrokeAligns.OUTSIDE) calc['box-sizing'] = 'content-box';
    }
    if (property.type === PropertyTypes.FILL_COLOR) {
      color = Color(`#${property.color}`).alpha(property.opacity).rgb().string();
      calc['background'] = `linear-gradient(to bottom, ${color},  ${color}), url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A')`;
      hostData.$element.addClass('hasHighContrast') 
    }
    return calc;
  }, {});
  return css;
};
export default function ($) {
  const NAME = 'Property-view';
  var PropertyView = function (element, options) {
    const $viewBox = $('<div class="preview-box" />');
    hostData = this;
    this.$element = $(element).removeClass('hasHighContrast').append($viewBox);
    options.length && $viewBox.css(
      Object.assign({
        "background": "#FFFFFF"
      }, consolidateProperties(options))
    );
  }
  PropertyView.prototype.destroy = function () {
    return this.$element.empty().removeData();
  }
   
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('property-view');
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data('property-view', (data = new PropertyView(this, options)));
    })
  }

  var old = $.fn.propertyView;

  $.fn.propertyView             = Plugin
  $.fn.propertyView.Constructor = PropertyView

  $.fn.propertyView.noConflict = function () {
    $.fn.propertyView = old
    return this
  }

  
}(jQuery);

