import PropertyTypes from 'enums/PropertyTypes';
const consolidateProperties = (properties) => (properties.reduce((calc, property) => {
    if (property.type === PropertyTypes.CORNER_RADIUS) {
        calc['border-top-left-radius'] = property.topLeft;
        calc['border-top-right-radius'] = property.topRight;
        calc['border-bottom-right-radius'] = property.bottomRight;
        calc['border-bottom-left-radius'] = property.bottomLeft;
    }
    return calc;
}, {}));
export default function ($) {
    const NAME = 'Property-view';
    var PropertyView = function (element, options) {
        const $viewBox = $('<div class="preview-box" />');
        options.length && $viewBox.css(Object.assign({
            "background": "#FFFFFF"
        }, consolidateProperties(options)));
        this.$element = $(element).append($viewBox);
    };
    PropertyView.prototype.destroy = function () {
        return this.$element.empty().removeData();
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('property-view');
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data('property-view', (data = new PropertyView(this, options)));
        });
    }
    var old = $.fn.propertyView;
    $.fn.propertyView = Plugin;
    $.fn.propertyView.Constructor = PropertyView;
    $.fn.propertyView.noConflict = function () {
        $.fn.propertyView = old;
        return this;
    };
}
(jQuery);
