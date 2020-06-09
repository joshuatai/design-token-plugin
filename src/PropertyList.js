import PropertyTypes from './PropertyTypes';
import { icon as CornerRadiusIcon } from './property-components/CornerRadius';
const icons = {
    [PropertyTypes.CORNER_RADIUS]: CornerRadiusIcon
};
const removeIcon = '<svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg>';
export default function ($) {
    const NAME = 'property-list';
    var PropertyList = function (element, options) {
        this.$element = $(element);
        this.$title = $('<h6>Properties</h6>');
        this.$propertyContainer = $('<ul></ul>').data('target', this);
        this.options = options;
        if (options && options.length > 0) {
            this.$element
                .addClass('show')
                .append(this.$title)
                .append(this.$propertyContainer.append(options.map((property, index) => {
                const icon = icons[property.type];
                let value;
                let title;
                if (property.type === PropertyTypes.CORNER_RADIUS) {
                    value = property.radius;
                    if (typeof property.radius === 'symbol') {
                        value = 'Mixed';
                        title = `top-left: ${property.topLeft}; top-right: ${property.topRight}; bottom-right: ${property.bottomRight}; bottom-left: ${property.bottomLeft};`;
                    }
                }
                return $(`<li>
              <span class="property-name">${property.type}</span>
              ${icon}
              <span class="property-value" ${title ? 'title="' + title + '"' : ''}>${value}</span>
              <span class="remove-property" data-index="${index}">${removeIcon}</span>
            </li>`).data('target', this);
            })));
        }
        this.$element.data('value', this.options);
    };
    PropertyList.prototype.destroy = function () {
        return this.$element.empty().removeData().removeClass('show');
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('property-list');
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data('property-list', (data = new PropertyList(this, options)));
        });
    }
    var old = $.fn.propertyList;
    $.fn.propertyList = Plugin;
    $.fn.propertyList.Constructor = PropertyList;
    $.fn.propertyList.noConflict = function () {
        $.fn.propertyList = old;
        return this;
    };
    $(document).on('click', `#${NAME} .remove-property`, function () {
        const $this = $(this);
        const index = $this.data('index');
        const $target = $this.closest('ul').data('target');
        if ($target.options && $target.options.length > 0) {
            $target.options.splice(index, 1);
        }
        console.log($target.options);
        $target.$element.trigger('property-remove');
    });
}
(jQuery);
