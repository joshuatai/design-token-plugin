import Color from 'color';
import _cloneDeep from 'lodash/cloneDeep';
import { getToken, getThemeMode, getCurrentThemeMode } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
const icons = {
    [PropertyTypes.CORNER_RADIUS]: '<span class="corner-radius-icon"></span>',
    [PropertyTypes.STROKE_WIDTH_ALIGN]: '<span class="stroke-width-icon"></span>',
    [PropertyTypes.STROKE_FILL]: '<div class="stroke-fill-icon"></div>',
    [PropertyTypes.FILL_COLOR]: '<div class="fill-color-icon"><div class="color-icon-opacity"></div></div>',
    [PropertyTypes.OPACITY]: '<div class="opacity-icon color-icon-opacity"></div>',
    [PropertyTypes.FONT]: '<div class="font-icon">A</div>',
    [PropertyTypes.SPACING]: `
    <div class="spacing-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 8.38237L3.71667 5.45318L3.71667 11.3116L1 8.38237Z" fill="black"/>
      <path d="M3 8.5L13 8.5" stroke="black"/>
      <path d="M15 8.38234L12.2833 11.3115V5.45315L15 8.38234Z" fill="black"/>
      <line x1="0.5" y1="2.45985e-08" x2="0.499999" y2="16" stroke="black"/>
      <line x1="15.5" y1="2.63555e-08" x2="15.5" y2="16" stroke="black"/>
      </svg>
    </div>`
};
const opacityBg = `url("data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A")`;
function traversingUseToken(token) {
    const themeModes = getThemeMode();
    const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
    const useThemeMode = formTokenList ? getCurrentThemeMode() : applyThemeMode;
    const existCurrentMode = token.properties.find(prop => prop.themeMode === useThemeMode);
    const defaultMode = token.properties.find(prop => prop.themeMode === defaultThemeMode);
    const property = existCurrentMode ? existCurrentMode : defaultMode;
    if (property.useToken) {
        return traversingUseToken(getToken(property.useToken));
    }
    else {
        return property;
    }
}
let property;
let css;
let value;
let title;
let secondValue;
let thridValue;
let formTokenList;
let applyThemeMode;
export default (options, isCalc = false) => {
    const themeModes = getThemeMode();
    const defaultMode = themeModes.filter(mode => mode.isDefault === true)[0];
    const $icon = $(icons[options[0].type]).attr('data-role', 'token-icon');
    property = options.length === 1 ? _cloneDeep(options[0]) : _cloneDeep(options);
    css = value = title = secondValue = thridValue = applyThemeMode = '';
    formTokenList = isCalc;
    if (isCalc && property instanceof Array) {
        const currentThemeMode = getCurrentThemeMode();
        const currentThemeProperty = property.filter(prop => prop.themeMode === currentThemeMode);
        if (currentThemeProperty.length > 0) {
            property = currentThemeProperty[0];
        }
        else {
            property = property.filter(prop => prop.themeMode = defaultMode.id)[0];
        }
    }
    if (property.type === PropertyTypes.FILL_COLOR) {
        const isUseToken = property.useToken;
        $icon.addClass('token-icon');
        if (themeModes.length > 1) {
            applyThemeMode = property.themeMode;
            thridValue = getThemeMode(applyThemeMode).name;
        }
        value = property.color;
        secondValue = `${Math.floor(property.opacity * 100)}%`;
        if (isUseToken) {
            const useToken = getToken(property.useToken);
            value = useToken.name;
            secondValue = '';
            property = traversingUseToken(useToken);
        }
        if (property.color === 'transparent' || property.color === 'null') {
            title = `Fill Color: transparent`;
            $icon
                .css('background', 'transparent')
                .children()
                .css({ opacity: 1, width: '14px' });
        }
        else {
            title = `Fill Color: #${property.color.toUpperCase()}; Opacity: ${Math.floor(property.opacity * 100)}%;`;
            const color = Color(`#${property.color}`);
            $icon
                .css({
                background: color,
                borderColor: color.isLight() ? '#dddddd' : '#FFFFFF'
            })
                .children()
                .css("opacity", (100 - Math.floor(property.opacity * 100)) / 100);
        }
    }
    if (property.type === PropertyTypes.STROKE_FILL) {
        const isUseToken = property.useToken;
        $icon.addClass('token-icon');
        if (themeModes.length > 1) {
            applyThemeMode = property.themeMode;
            thridValue = getThemeMode(applyThemeMode).name;
        }
        value = property.color;
        secondValue = `${Math.floor(property.opacity * 100)}%`;
        if (isUseToken) {
            const useToken = getToken(property.useToken);
            value = useToken.name;
            secondValue = '';
            property = traversingUseToken(useToken);
        }
        title = `Stroke Color: #${property.color.toUpperCase()}`;
        const color = Color(`#${property.color}`).alpha(property.opacity);
        css = `linear-gradient(${color}, ${color}), ${opacityBg}`;
        $icon
            .addClass('token-icon')
            .css({
            background: css,
            borderColor: color.isLight() ? '#dddddd' : '#FFFFFF'
        });
    }
    if (property.type === PropertyTypes.CORNER_RADIUS) {
        if (typeof property.radius === 'symbol') {
            value = 'Mixed';
            title = `top-left: ${property.topLeft}; top-right: ${property.topRight}; bottom-right: ${property.bottomRight}; bottom-left: ${property.bottomLeft};`;
        }
        else {
            value = property.radius;
            title = `Corner Radius: ${value}`;
        }
    }
    if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
        value = property.width;
        secondValue = property.align;
        title = `Stroke Width: ${value} and Stroke Align: ${secondValue}`;
    }
    if (property.type === PropertyTypes.OPACITY) {
        const isUseToken = property.useToken;
        if (themeModes.length > 1) {
            applyThemeMode = property.themeMode;
            applyThemeMode ? thridValue = getThemeMode(applyThemeMode).name : thridValue = defaultMode.name;
        }
        value = `${property.opacity}%`;
        if (isUseToken) {
            const useToken = getToken(property.useToken);
            value = useToken.name;
            secondValue = '';
            property = traversingUseToken(useToken);
        }
        title = `Opacity: ${property.opacity}%`;
    }
    if (property.type === PropertyTypes.FONT) {
        value = property.fontName.family;
        secondValue = property.fontSize;
        title = `Font Family: ${property.fontName.family}, Font Size: ${property.fontSize}`;
    }
    if (property.type === PropertyTypes.SPACING) {
        value = property.value;
        title = `Spacing: ${value}`;
    }
    if (property.useToken) {
        let tokenName = getToken(property.useToken).name;
        value = tokenName;
    }
    $icon.attr('title', title);
    return {
        value,
        title,
        secondValue,
        thridValue,
        $icon
    };
};
