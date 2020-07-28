import properties2css from 'utils/properties2css';
let hostData;
export default function ($) {
    const NAME = 'Property-view';
    var PropertyView = function (element, options) {
        const $viewBox = $('<div class="preview-box" />');
        hostData = this;
        this.$element = $(element).removeClass('hasLight').append($viewBox);
        options.length && $viewBox.css(Object.assign({
            "background": "#FFFFFF"
        }, properties2css(options)));
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
