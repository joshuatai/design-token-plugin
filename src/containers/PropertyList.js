import preventEvent from 'utils/preventEvent';
import BrowserEvents from 'enums/BrowserEvents';
import PropertyTypes from 'enums/PropertyTypes';
import { icon as CornerRadiusIcon } from './property-components/CornerRadius';
import { getToken } from 'model/DataManager';
const icons = {
    [PropertyTypes.CORNER_RADIUS]: CornerRadiusIcon
};
const removeIcon = '<svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg>';
let $host;
export default function ($) {
    const NAME = 'property-list';
    var PropertyList = function (element, options) {
        const $title = $('<h6>Properties</h6>');
        this.$propertyContainer = $('<ul class="property-item-container"></ul>');
        this.options = options;
        if (options && options.length > 0) {
            $host = this.$element = $(element)
                .addClass('show')
                .append($title)
                .append(this.$propertyContainer
                .append(options.map((property, index) => {
                const parent = getToken(property.parent);
                const icon = icons[property.type];
                const $remove = $(`<span class="remove-property">${removeIcon}</span>`);
                let value;
                let title;
                if (property.type === PropertyTypes.CORNER_RADIUS) {
                    if (typeof property.radius === 'symbol') {
                        value = 'Mixed';
                        title = `top-left: ${property.topLeft}; top-right: ${property.topRight}; bottom-right: ${property.bottomRight}; bottom-left: ${property.bottomLeft};`;
                    }
                    else {
                        value = property.radius;
                        title = `corner radius: ${property.radius}`;
                    }
                    if (property.useToken) {
                        value = getToken(property.useToken).name;
                    }
                    // parent.usedBy.length > 0 && $remove.attr({
                    //   'disabled': true,
                    //   'title': `This token has been linked by token: ${parent.usedBy.map(id => getToken(id).name)}`
                    // })
                }
                return $(`
                <li class="property-item">
                  <span class="sortable-handler"></span>
                  <span class="property-name">${property.type}</span>
                  ${icon}
                  <span class="property-value" ${title ? 'title="' + title + '"' : ''}>${value}</span>
                </li>
              `)
                    .append($remove)
                    .data('property', property);
            })));
        }
        if (options.length > 1) {
            this.$propertyContainer.addClass('sortable').sortable({
                placeholder: 'ui-sortable-placeholder',
                handle: '.sortable-handler',
                axis: "y"
            });
        }
    };
    PropertyList.prototype.destroy = function () {
        return this.$element.empty().removeData().hide();
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
    $(document).on(BrowserEvents.CLICK, '.property-item', function () {
        $host.trigger('property-edit', [$(this).data('property')]);
    });
    $(document).on(BrowserEvents.CLICK, `#${NAME} .remove-property`, function (event) {
        !$(this).is('[disabled]') && $host.trigger('property-remove', $(this).parent().data('property'));
        preventEvent(event);
    });
    $(document).on("sortupdate", '.property-item-container', function (event, ui) {
        const { $propertyContainer } = $host.data('property-list');
        const data = $.makeArray($propertyContainer.children().map((i, prop) => $(prop).data('property')));
        $host.trigger('property-sort', [data]);
    });
}
(jQuery);
