import Color from 'color';
import PropertyTypes from 'enums/PropertyTypes';
const icons = {
    [PropertyTypes.CORNER_RADIUS]: '<span class="corner-radius-icon"></span>',
    [PropertyTypes.STROKE_WIDTH_ALIGN]: '<span class="stroke-width-icon"></span>',
    [PropertyTypes.STROKE_FILL]: '<div class="stroke-fill-icon"></div>',
    [PropertyTypes.FILL_COLOR]: '<div class="fill-color-icon"><div class="color-icon-opacity"></div></div>',
};
const opacityBg = `url("data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A")`;
export default (options) => {
    let css;
    const $icon = $(icons[options.type]);
    if (options.type === PropertyTypes.FILL_COLOR) {
        css = Color(`#${options.color}`);
        $icon
            .addClass('token-icon')
            .css("background", css)
            .children()
            .css("opacity", (100 - (options.opacity * 100)) / 100);
    }
    if (options.type === PropertyTypes.STROKE_FILL) {
        const color = Color(`#${options.color}`).alpha(options.opacity);
        css = `linear-gradient(${color}, ${color}), ${opacityBg}`;
        $icon
            .addClass('token-icon')
            .css("background", css);
    }
    return $icon;
};
