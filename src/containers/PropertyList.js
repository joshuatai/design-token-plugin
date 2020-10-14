import React, { useEffect, useRef } from "react";
import usePropertySetting from 'hooks/usePropertySetting';
import usePropertyInfo from 'hooks/usePropertyInfo';
import PropertyIcon from './property-components/PropertyIcon';
const RemoveIcon = () => React.createElement("svg", { className: "svg", width: "12", height: "6", viewBox: "0 0 12 6", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M11.5 3.5H.5v-1h11v1z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" }));
let $host;
// export default function ($) {
const NAME = 'property-list';
// var PropertyList = function (element, options) {
//   const $title = $('');
//   this.$propertyContainer = $('');
//   this.options = options;
//   if (options && options.length > 0) {
//     $host = this.$element  = $(element)
//       .addClass('show')
//       .append($title)
//       .append(
//         this.$propertyContainer
//           .append(options.map((property, index) => {
//             // let { $icon, value, title, secondValue, thridValue } = PropertyIcon([property]);
//             // const token = getToken(property.parent);
//             // const referTokens = referByToken(token);
//             // const $remove = $(``);
//             // referTokens.length > 0 && $remove.attr({
//             //   'disabled': true,
//             //   'title': `This token has been linked by token: ${referTokens.map(token => token.name)}`
//             // });
//             // const propertyItem = $(``)
//             //   .append(``)
//             //   .append(``)
//             //   .append($icon)
//             //   .append(``)
//             //   .append(secondValue ? $(``) : null)
//             //   .append(thridValue ? $(``) : null)
//             //   .append($remove)
//             //   .data('property', property);
//             // return propertyItem;
//           }))
//       );
//   }
//   
// }
// $(document).on(BrowserEvents.CLICK, '.property-item', function () {
//   $host.trigger('property-edit', [$(this).data('property')]);
// });
// $(document).on(BrowserEvents.CLICK, `#${NAME} .remove-property`, function (event) {
//   !$(this).is('[disabled]') && $host.trigger('property-remove', $(this).parent().data('property'));
//   preventEvent(event);
// });
$(document).on("sortupdate", '.property-item-container', function (event, ui) {
    const { $propertyContainer } = $host.data('property-list');
    const data = $.makeArray($propertyContainer.children().map((i, prop) => $(prop).data('property')));
    $host.trigger('property-sort', [data]);
});
const PropertyItem = ({ property }) => {
    const { title, value, secondValue, thridValue } = usePropertyInfo(property);
    return React.createElement("li", { className: "property-item" },
        React.createElement("span", { className: "sortable-handler" }),
        React.createElement("span", { className: "property-name" }, property.type),
        React.createElement(PropertyIcon, { options: property }),
        React.createElement("span", { className: "property-value", title: title }, value),
        secondValue && React.createElement("span", { className: "property-second-value" }, secondValue),
        thridValue && React.createElement("span", { className: "property-third-value" }, thridValue),
        React.createElement("span", { className: "remove-property" },
            React.createElement(RemoveIcon, null)));
};
const PropertyList = () => {
    const { propertiesSetting } = usePropertySetting();
    const $itemContainerRef = useRef(null);
    useEffect(() => {
        if (propertiesSetting.length > 1) {
            $($itemContainerRef.current).sortable({
                placeholder: 'ui-sortable-placeholder',
                handle: '.sortable-handler',
                axis: "y"
            });
        }
    });
    return propertiesSetting.length > 0 ?
        React.createElement("div", { id: "property-list", className: propertiesSetting.length > 1 ? 'setting-row ui-sortable' : 'setting-row' },
            React.createElement("h6", null, "Properties"),
            React.createElement("ul", { ref: $itemContainerRef, className: "property-item-container" }, propertiesSetting.map(property => React.createElement(PropertyItem, { key: property.id, property: property })))) :
        null;
};
export default PropertyList;
