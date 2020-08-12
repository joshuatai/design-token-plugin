import properties2css from 'utils/properties2css';
let hostData;
const viewerBG = ['#707070', '#9F9F9F', '#606060', '#A7A7A7'];
export default function ($) {
    const NAME = 'Property-view';
    var PropertyView = function (element, options) {
        const $viewBox = $('<div class="preview-box">Preview</div>');
        hostData = this;
        this.options = options;
        this.$element = $(element)
            .removeClass('hasLight')
            .append($viewBox);
        if (options.length) {
            const css = properties2css(options);
            this.$element.addClass('hasProperty');
            $viewBox.css(Object.assign({
                "background": "#FFFFFF"
            }, css));
        }
    };
    PropertyView.prototype.destroy = function () {
        return this.$element.removeClass('hasProperty').empty().removeData();
    };
    function Plugin(option) {
        return this.each(function () {
            let $this = $(this);
            let data = $this.data('property-view');
            let options = typeof option == 'object' && option;
            if (data && typeof option === 'string' && option === 'rerender') {
                options = data.options;
            }
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
