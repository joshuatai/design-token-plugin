import React, { useEffect, useRef, useState } from "react";
import Color from 'color';
import PropertyIcon from './PropertyIcon';
import ThemeModes from './ThemeModes';
import PureTokens from "./PureTokens";
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import InputStatus from "enums/InputStatus";
import FillColorModel from 'model/FillColor';
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';
import BrowserEvents from 'enums/BrowserEvents';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeColorModel from 'model/StrokeFill';
import colorPicker from 'utils/colorPicker';
SelectText(jQuery);
colorPicker(jQuery);
const FillColor = ({ value = null, propType }) => {
    const { defaultMode, themeModes, getThemeMode } = useThemeModes();
    const { getToken, getPureTokensByProperty } = useTokens();
    const { traversing } = useProperties();
    const { setting: tokenSetting } = useTokenSetting();
    const { setPropertySetting } = usePropertySetting();
    const newOption = { parent: tokenSetting.token.id, themeMode: defaultMode.id };
    const Model = propType === PropertyTypes.FILL_COLOR ? FillColorModel : StrokeColorModel;
    const [setting, setSetting] = useState(value || new Model(newOption));
    const { color, opacity, useToken } = setting;
    const pureTokens = getPureTokensByProperty(setting);
    const $colorRef = useRef();
    const $opacityRef = useRef();
    const _useToken = getToken(useToken);
    const colorValue = _useToken ? _useToken.name : color;
    const opacityValue = opacity.toString();
    const focusHandler = (e) => {
        if (_useToken)
            return;
        const $target = e.target;
        const $valContainer = $target.closest('.val-container');
        $($target).selectText();
        if ($valContainer)
            $valContainer.classList.add('focus');
    };
    const keyUpHandler = (e) => {
        inputCheck.call(e.target, e);
    };
    const blurHandler = (e) => {
        const $target = e.target;
        const $valContainer = $target.closest('.val-container');
        const propType = $target.getAttribute('prop-type');
        const orginVal = setting[propType];
        $target.textContent = $target.textContent.replace(propType === 'color' ? '#' : '%', '');
        valChange
            .call($target, orginVal, (val) => {
            if (propType === 'opacity') {
                let _opacity = val;
                _opacity = Math.min(Math.max(0, _opacity), 100);
                if (_opacity === orginVal)
                    return { status: InputStatus.NO_CHANGE };
                return { status: InputStatus.VALID, value: _opacity };
            }
            return { status: InputStatus.VALID, value: val };
        })
            .then(res => {
            if (res.status === InputStatus.VALID) {
                propType === 'color' ? setting.color = res.value === 'transparent' ? 'transparent' : setting.color = Color(`#${res.value}`).hex().replace('#', '') : setting.opacity = res.value;
                setSetting(new Model(setting));
            }
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE && propType === 'opacity') {
                $target.textContent = `${$target.textContent}%`;
            }
        });
        if ($valContainer)
            $valContainer.classList.remove('focus');
    };
    const useThemeHandler = (mode) => {
        setting.themeMode = mode.id;
        setSetting(new Model(setting));
    };
    const useTokenHandler = (usedToken) => {
        const usedProperty = propType === PropertyTypes.FILL_COLOR ? traversing(usedToken, getThemeMode(setting.themeMode)) : traversing(usedToken, getThemeMode(setting.themeMode));
        setting.useToken = usedToken.id;
        setting.color = usedProperty.color;
        setting.opacity = usedProperty.opacity;
        setting.blendMode = usedProperty.blendMode;
        setting.fillType = usedProperty.fillType;
        setting.visible = usedProperty.visible;
        setSetting(new Model(setting));
    };
    const detachTokenHandler = () => {
        const usedProperties = traversing(getToken(setting.useToken), getThemeMode(setting.themeMode));
        setting.useToken = '';
        if (usedProperties instanceof Array) {
        }
        setSetting(new Model(setting));
    };
    function colorPicker(e) {
        const $icon = $(this);
        if (!$icon.is('[data-disabled=true')) {
            $icon.colorPicker({
                container: '#react-page',
                color: `#${setting.color}`,
                opacity: setting.opacity
            });
        }
    }
    function colorPickerChange(event, picker) {
        setting.color = picker.color.replace('#', '');
        setting.opacity = picker.opacity;
        setSetting(new Model(setting));
    }
    const addPicker = () => {
        $(document).on(BrowserEvents.CLICK, `.fill-color-icon, .stroke-fill-icon`, colorPicker);
        $(document).on('color-picker-change', colorPickerChange);
    };
    const removePicker = () => {
        $(document).off(BrowserEvents.CLICK, `.fill-color-icon, .stroke-fill-icon`, colorPicker);
        $(document).off('color-picker-change');
    };
    useEffect(() => {
        addPicker();
        setPropertySetting(setting);
        return removePicker;
    }, [setting]);
    return setting ? React.createElement("div", { className: themeModes.length > 1 ? 'property-setting-section hasThemeMode' : 'property-setting-section' },
        React.createElement("div", { className: "custom-val" },
            React.createElement("div", { className: setting.useToken ? 'val-container use-token' : 'val-container' },
                React.createElement(PropertyIcon, { options: [setting], disabled: setting.color === 'transparent' || setting.useToken !== '' }),
                React.createElement("span", { ref: $colorRef, "prop-type": "color", "data-type": "hex,transparent", className: 'color-val', title: colorValue, "is-required": "true", placeholder: "Hex/transparent", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, colorValue),
                colorValue !== 'transparent' && React.createElement("span", { ref: $opacityRef, "prop-type": "opacity", "data-type": "int", className: pureTokens.length ? 'opacity-val hasReferenceToken' : 'opacity-val', title: `${opacityValue}%`, "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, `${opacityValue}%`),
                React.createElement(ThemeModes, { property: setting, useThemeHandler: useThemeHandler }),
                React.createElement(PureTokens, { property: setting, pureTokens: pureTokens, useTokenHandler: useTokenHandler, detachTokenHandler: detachTokenHandler })))) : React.createElement(React.Fragment, null);
};
export default FillColor;
