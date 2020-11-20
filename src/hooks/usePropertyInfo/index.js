import Color from 'color';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
const opacityBg = `url("data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A")`;
const usePropertyInfo = (property, fromTokenList = false) => {
    const { themeModes, defaultMode, currentMode, getThemeMode } = useThemeModes();
    const { traversing } = useProperties();
    const { getToken } = useTokens();
    let _property = property;
    let style, value, title, secondValue, thridValue;
    value = title = secondValue = thridValue = '';
    style = {};
    if (fromTokenList && property instanceof Array) {
        const currentThemeMode = currentMode || defaultMode;
        const currentThemeProperties = property.filter(prop => prop.themeMode === currentThemeMode.id);
        if (currentThemeProperties.length > 0) {
            _property = currentThemeProperties.pop();
        }
        else {
            const defaultThmeeProperties = property.filter(prop => prop.themeMode === defaultMode.id);
            if (defaultThmeeProperties.length > 0) {
                _property = defaultThmeeProperties.pop();
            }
        }
    }
    if (_property) {
        if (_property.type === PropertyTypes.CORNER_RADIUS) {
            if (_property.radius === Mixed) {
                value = 'Mixed';
                title = `top-left: ${_property.topLeft}; top-right: ${_property.topRight}; bottom-right: ${_property.bottomRight}; bottom-left: ${_property.bottomLeft};`;
            }
            else {
                value = _property.radius;
                title = `Corner Radius: ${value}`;
            }
        }
        if (_property.type === PropertyTypes.OPACITY) {
            const applyThemeMode = getThemeMode(_property.themeMode);
            if (themeModes.length > 1) {
                applyThemeMode ? thridValue = applyThemeMode.name : thridValue = defaultMode.name;
            }
            value = `${_property.opacity}%`;
            if (_property.useToken) {
                const useToken = getToken(_property.useToken);
                value = useToken.name;
                secondValue = '';
                _property = traversing(useToken, applyThemeMode);
            }
            title = `Opacity: ${_property.opacity}%`;
        }
        if (_property.type === PropertyTypes.FILL_COLOR) {
            const applyThemeMode = fromTokenList ? currentMode : getThemeMode(_property.themeMode);
            if (themeModes.length > 1) {
                applyThemeMode ? thridValue = applyThemeMode.name : thridValue = defaultMode.name;
            }
            value = _property.color;
            secondValue = `${_property.opacity}%`;
            if (_property.useToken) {
                const useToken = getToken(_property.useToken);
                value = useToken.name;
                secondValue = '';
                _property = traversing(useToken, applyThemeMode);
            }
            if (_property.color === 'transparent') {
                title = `Fill Color: transparent`;
                style.background = 'transparent';
                style.opacity = 1;
                style.width = '14px';
            }
            else {
                title = `Fill Color: #${_property.color.toUpperCase()}; Opacity: ${_property.opacity}%;`;
                const color = Color(`#${_property.color}`);
                style.background = color;
                style.borderColor = color.isLight() ? '#dddddd' : '#FFFFFF';
                style.opacity = (100 - _property.opacity) / 100;
            }
        }
        if (_property.type === PropertyTypes.STROKE_FILL) {
            const applyThemeMode = fromTokenList ? currentMode : getThemeMode(_property.themeMode);
            if (themeModes.length > 1) {
                applyThemeMode ? thridValue = applyThemeMode.name : thridValue = defaultMode.name;
            }
            value = _property.color;
            secondValue = `${_property.opacity}%`;
            if (_property.useToken) {
                const useToken = getToken(_property.useToken);
                value = useToken.name;
                secondValue = '';
                _property = traversing(useToken, applyThemeMode);
            }
            if (_property.color === 'transparent') {
                title = 'Stroke Color: transparent';
                secondValue = '';
                style.background = opacityBg;
            }
            else {
                title = `Stroke Color: #${_property.color.toUpperCase()}; Opacity: ${_property.opacity}%;`;
                const color = Color(`#${_property.color}`).alpha(_property.opacity);
                style.background = `linear-gradient(${color}, ${color}), ${opacityBg}`;
                style.borderColor = color.isLight() ? '#dddddd' : '#FFFFFF';
            }
        }
        if (_property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
            value = _property.width;
            secondValue = _property.align;
            if (_property.useToken) {
                const useToken = getToken(_property.useToken);
                value = useToken.name;
                secondValue = '';
                _property = traversing(useToken);
            }
            title = `Stroke Width: ${_property.width} and Stroke Align: ${_property.align}`;
        }
        if (property.type === PropertyTypes.FONT_FAMILY_STYLE) {
            value = property.family;
            secondValue = property.style;
            title = `Font Family: ${property.family}, Font Style: ${property.style}`;
        }
        if (_property.type === PropertyTypes.SPACING) {
            value = _property.value;
            title = `Spacing: ${value}`;
        }
        if (property.useToken) {
            let token = getToken(property.useToken);
            value = token.name;
        }
        return {
            type: _property.type,
            value,
            title,
            secondValue,
            thridValue,
            style
        };
    }
    else {
        return {
            type: null,
            value,
            title,
            secondValue,
            thridValue,
            style
        };
    }
};
export default usePropertyInfo;
